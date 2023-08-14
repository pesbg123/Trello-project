import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from 'src/jwt/jwt.service';

const offset = 1000 * 60 * 60 * 9;
const koreaNow = new Date(new Date().getTime() + offset);

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  connectedClients: { [socketId: string]: number } = {};
  clientName: { [socketId: string]: string } = {};
  roomUsers: { [key: string]: string[] } = {};

  @SubscribeMessage('inviteUser')
  handleEvent(@MessageBody() data: any) {
    const payload = {
      userName: data.userName,
      projectName: data.projectName,
      date: koreaNow.toISOString(),
    };

    let user = [];
    for (let key in this.connectedClients) {
      if (this.connectedClients[key] === data.userId / 1) user.push(key);
    }

    user.forEach((sock) => {
      this.server.to(sock).emit('projectUser', { data: payload });
    });
  }

  handleConnection(@ConnectedSocket() client: Socket): Promise<any> {
    const authorization = client.request.headers.cookie;

    if (!authorization) return;
    const token = authorization.split(' ')[1].split('=')[1];

    const decode = this.jwtService.verify(token, process.env.ACCESS_SECRET_KEY);
    this.connectedClients[client.id] = Number(decode.id);
    console.log(this.connectedClients);
  }

  handleDisconnect(client: Socket) {
    delete this.connectedClients[client.id];
    delete this.roomUsers[this.clientName[client.id]];

    //클라이언트 연결 종료 시 해당 클라이언트가 속한 모든 방에서 유저를 제거
    Object.keys(this.roomUsers).forEach((room) => {
      const index = this.roomUsers[room]?.indexOf(this.clientName[client.id]);
      if (index !== -1) {
        this.roomUsers[room] = this.roomUsers[room].slice(0, index).concat(this.roomUsers[room].slice(index + 1));
        this.server.to(room).emit('userLeft', { userId: this.clientName[client.id], room });
        this.server.to(room).emit('userList', { room, userList: this.roomUsers[room] });
      }
    });
    delete this.clientName[client.id];

    //모든 방의 유저 목록을 업데이트해 emit
    Object.keys(this.roomUsers).forEach((room) => {
      this.server.to(room).emit('userList', { room, userList: this.roomUsers[room] });
    });

    //연결된 클라이언트 목록을 업데이트해 emit
    this.server.emit('userList', { room: null, userLiset: Object.keys(this.connectedClients) });
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, data: any): void {
    const room = data.room;
    const name = data.name;
    this.clientName[client.id] = name;
    if (client.rooms.has(room)) return;

    client.join(room);
    if (!this.roomUsers[room]) this.roomUsers[room] = [];

    this.roomUsers[room].push(this.clientName[client.id]);
    this.server.to(room).emit('userList', { room, userList: this.roomUsers[room] });

    this.server.emit('userList', { room: null, userList: Object.keys(this.connectedClients) });
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, data: { message: string; room: string }): void {
    this.server.to(data.room).emit('chatMessage', { userId: this.clientName[client.id], message: data.message, room: data.room });
  }

  @SubscribeMessage('newMessage')
  announceNewMessage(client: Socket, data: { message: string; room: string; userName: string }): void {
    const date = new Date(Date.now());
    this.server.to(data.room).emit('newMessage', { userId: this.clientName[client.id], message: data.message, room: data.room, date });
  }
}
