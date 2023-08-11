// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { onlineMap } from './online-map';
// import { Logger } from '@nestjs/common';
// import { JwtService } from 'src/jwt/jwt.service';

// @WebSocketGateway({ cors: { origin: '*' } })
// export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   constructor(private jwtService: JwtService) {}
//   @WebSocketServer() server: Server;
//   logger = new Logger();

//   //emit을 받았을 때
//   @SubscribeMessage('test')
//   handleEvent(@MessageBody() data: any) {
//     let user = [];
//     for (let key in onlineMap) {
//       if (onlineMap[key] / 1 === data.id) user.push(key);
//     }
//     user.forEach((sock) => {
//       //해당 로그인 유저에게 보냄
//       this.server.to(sock).emit('tester', data);
//     });
//   }

//   @SubscribeMessage('login')
//   handleLogin(@MessageBody() data: { id: number; channels: number[] }, @ConnectedSocket() socket: Socket) {
//     const newNamespace = socket.nsp;
//     console.log('login', newNamespace);
//     onlineMap[socket.nsp.name][socket.id] = data.id;
//     newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
//     data.channels.forEach((channel: number) => {
//       console.log('join', socket.nsp.name, channel);
//       socket.join(`${socket.nsp.name}-${channel}`);
//     });
//   }

//   async handleConnection(@ConnectedSocket() socket: Socket): Promise<any> {
//     const authorization = socket.request.headers.cookie;
//     if (!authorization) return;
//     const token = authorization.split('=')[1];

//     const decode = await this.jwtService.verify(token, process.env.REFRESH_SECRET_KEY);
//     onlineMap[socket.id] = decode.id;
//     console.log(onlineMap);
//   }

//   handleDisconnect(@ConnectedSocket() socket: Socket) {
//     delete onlineMap[socket.id];
//   }
// }
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

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  connectedClients: { [socketId: string]: number } = {};
  clientNickname: { [socketId: string]: string } = {};
  roomUsers: { [key: string]: string[] } = {};

  //emit을 받았을 때
  @SubscribeMessage('test')
  handleEvent(@MessageBody() data: any) {
    let user = [];
    for (let key in this.connectedClients) {
      if (this.connectedClients[key] / 1 === data.id) user.push(key);
    }
    user.forEach((sock) => {
      //해당 로그인 유저에게 보냄
      this.server.to(sock).emit('tester', data);
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
