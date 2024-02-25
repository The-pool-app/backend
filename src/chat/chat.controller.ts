import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { CreateChatDto } from './dto';
import { ChatService } from './chat.service';
import { ResponseStatus } from 'src/types';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard';

@UseGuards(JwtAuthGuard)
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async create(
    @GetUser('id') user: number,
    @Body() createChatDto: CreateChatDto,
  ): Promise<ResponseStatus> {
    const message = await this.chatService.create(user, createChatDto);
    return {
      success: true,
      message: 'Chat created successfully',
      data: message,
    };
  }

  @Get(':receiverId')
  async getChat(
    @GetUser('id') user: number,
    @Param('receiverId') receiverId: number,
  ) {
    return this.chatService.findAll(user, receiverId);
  }
}
