import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../domain/entities/conversation.entity';
import { Message } from '../domain/entities/message.entity';
import { FilesController } from './files.controller';
import { FileUploadService } from './file-upload.service';
import { FileAttachment } from 'src/domain/entities/file-attachment.entity';
import { User } from 'src/domain/entities/user.entity';
import { ConvesationsGateway } from './conversations.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, FileAttachment, User]),
  ],
  providers: [
    ConversationsService,
    MessagesService,
    FileUploadService,
    ConvesationsGateway,
  ],
  controllers: [ConversationsController, MessagesController, FilesController],
})
export class ConversationsModule {}
