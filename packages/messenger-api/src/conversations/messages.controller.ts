import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';
import { MessageModel } from './model/message.model';
import { EditMessageModel } from './model/edit-message.model';

@UseGuards(AuthGuard)
@Controller('conversations/:conversationId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.messagesService.getMessagesByConversation(+conversationId);
  }

  @Post()
  async sendMessage(@Req() req, @Body() messageData: MessageModel) {
    return this.messagesService.saveMessage(req.user.id, messageData);
  }

  @Put(':messageId')
  async editMessage(
    @Param('messageId') messageId: string,
    @Body('newMessage') newMessage: EditMessageModel,
    @Req() req,
  ) {
    return this.messagesService.editMessage(req.user.userId, newMessage);
  }

  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: string, @Req() req) {
    return this.messagesService.deleteMessage(
      Number(messageId),
      req.user.userId,
    );
  }
}
