import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ServertoClientEvents } from './types/events.types';
import { messages } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'thepool-ns',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<any, ServertoClientEvents>;
  constructor(private readonly eventsService: EventsService) {}

  afterInit(client: Socket) {
    // Authorizations
    //  client.use()
    Logger.log('Init', client.id);
  }

  handleConnection(client: any) {
    Logger.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: any) {
    Logger.log('Client disconnected: ' + client.id);
  }

  sendMessage(message: messages) {
    this.server.emit('createMessage', message);
  }
  receiveMessage(message: messages) {
    this.server.emit('receiveMessage', message);
  }
  receiveAllMessages(messages: messages[]) {
    this.server.emit('getMessages', messages);
  }
  updateMessage(message: messages) {
    this.server.emit('updateMessages', message);
  }

  getUnreadMessages(messages: messages[]) {
    this.server.emit('getUnreadMessages', messages);
  }
  getUnreadMessagesCount(count: number) {
    this.server.emit('getUnreadMessagesCount', count);
  }
}
