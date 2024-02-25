import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

// @UseGuards(JwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'api/v1/chat',
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  afterInit(client: Socket) {
    Logger.log('Init', client.id);
  }
  @SubscribeMessage('createChat')
  async create() {
    // const chatMessage = await this.chatService.create(createChatDto.message);
    // client.emit('newMes', createChatDto.message);
    // return this.chatService.create(createChatDto);
  }
}
