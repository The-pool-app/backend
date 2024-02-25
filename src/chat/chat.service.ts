import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { DatabaseService } from 'src/database/database.service';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class ChatService {
  constructor(
    private databaseService: DatabaseService,
    private eventsGateWay: EventsGateway,
  ) {}
  async create(userId: number, createChatDto: CreateChatDto) {
    const newMessage = await this.databaseService.messages.create({
      data: {
        content: createChatDto.message,
        senderId: userId,
        receiverId: createChatDto.receiverId,
      },
    });
    // emit event createMessage
    return newMessage;
  }

  async findAll(senderId: number, receiverId: number) {
    const getMessages = await this.databaseService.messages.findMany({
      where: {
        OR: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
    });
    this.eventsGateWay.receiveAllMessages(getMessages);
    return `This action returns all messages in a chat between ${senderId} and ${receiverId}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
