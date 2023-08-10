import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from 'src/jwt/jwt.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  connectedClients: { [socketId: string]: boolean } = {};
  clientNickname: { [socketId: string]: string } = {};
  roomUsers: { [key: string]: string[] } = {};

  async handleConnection(@ConnectedSocket() client: Socket): Promise<any> {
    const authorization = client.request.headers.cookie;
    if (!authorization) return;
    const token = authorization.split('=')[1];

    const decode = await this.jwtService.verify(token, process.env.REFRESH_SECRET_KEY);
    this.connectedClients[client.id] = decode.id;
    console.log(this.connectedClients);
  }

  handleDisconnect(client: Socket) {
    delete this.connectedClients[client.id];

    //클라이언트 연결 종료 시 해당 클라이언트가 속한 모든 방에서 유저를 제거
    Object.keys(this.roomUsers).forEach((room) => {
      const index = this.roomUsers[room]?.indexOf(this.clientNickname[client.id]);
      if (index !== -1) {
        this.roomUsers[room] = this.roomUsers[room].slice(0, index).concat(this.roomUsers[room].slice(index + 1));
        this.server.to(room).emit('userLeft', { userId: this.clientNickname[client.id], room });
        this.server.to(room).emit('userList', { room, userList: this.roomUsers[room] });
      }
    });

    //모든 방의 유저 목록을 업데이트해 emit
    Object.keys(this.roomUsers).forEach((room) => {
      this.server.to(room).emit('userList', { room, userList: this.roomUsers[room] });
    });

    //연결된 클라이언트 목록을 업데이트해 emit
    this.server.emit('userList', { room: null, userLiset: Object.keys(this.connectedClients) });
  }

  @SubscribeMessage('setUserNick')
  handleSetUserNick(client: Socket, nick: string): void {
    this.clientNickname[client.id] = nick;
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, room: string): void {
    if (client.rooms.has(room)) return;

    client.join(room);

    if (!this.roomUsers[room]) this.roomUsers[room] = [];

    this.roomUsers[room].push(this.clientNickname[client.id]);
    this.server.to(room).emit('userJoined', { userId: this.clientNickname[client.id], room });
    this.server.to(room).emit('userList', { room, userList: this.roomUsers[room] });

    this.server.emit('userList', { room: null, userList: Object.keys(this.connectedClients) });
  }

  @SubscribeMessage('exit')
  handleExit(client: Socket, room: string): void {
    if (!client.rooms.has(room)) return;

    client.leave(room);

    const index = this.roomUsers[room]?.indexOf(this.clientNickname[client.id]);
    if (index !== -1) {
      this.roomUsers[room] = this.roomUsers[room].slice(0, index).concat(this.roomUsers[room].slice(index + 1));
      this.server.to(room).emit('userLeft', { userId: this.clientNickname[client.id], room });
      this.server.to(room).emit('userList', { room, userList: this.roomUsers[room] });
    }

    Object.keys(this.roomUsers).forEach((room) => {
      this.server.to(room).emit('userList', { room, userList: this.roomUsers[room] });
    });

    this.server.emit('userList', { room: null, userList: Object.keys(this.connectedClients) });
  }

  @SubscribeMessage('getUserList')
  handleGetUserList(client: Socket, room: string): void {
    this.server.to(room).emit('userList', { room, userList: this.roomUsers[room] });
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, data: { message: string; room: string }): void {
    this.server.to(data.room).emit('chatMessage', { userId: this.clientNickname[client.id], message: data.message, room: data.room });
  }
}
