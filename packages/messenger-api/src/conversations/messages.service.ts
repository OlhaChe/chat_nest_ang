import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Message } from '../domain/entities/message.entity';
import { MessageModel } from './model/message.model';
import { Conversation } from 'src/domain/entities/conversation.entity';
import { User } from 'src/domain/entities/user.entity';
import { FileAttachment } from 'src/domain/entities/file-attachment.entity';
import { plainToInstance } from 'class-transformer';
import { MessageDto } from 'src/common/dto/message.dto';
import { EditMessageModel } from './model/edit-message.model';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(FileAttachment)
    private readonly filesRepository: Repository<FileAttachment>,
  ) {}

  async saveMessage(userId: number, messageData: MessageModel) {
    let files = [];
    const conversation = await this.conversationsRepository.findOne({
      where: { conversationId: messageData.conversationId },
    });

    const user = await this.usersRepository.findOne({
      where: { userId: userId },
    });

    if (messageData.fileIds) {
      files = await this.filesRepository.findBy({
        id: In(messageData.fileIds),
        message: null,
      });
    }

    const newMessage = this.messagesRepository.create({
      conversation: conversation,
      user: user,
      message: messageData.message,
      files: files,
    });
    const savedMessage = await this.messagesRepository.save(newMessage);
    return plainToInstance(MessageDto, savedMessage);
  }

  async getMessagesByConversation(conversationId: number) {
    const messages = await this.messagesRepository.find({
      where: { conversation: { conversationId: conversationId } },
      order: { createdAt: 'ASC' },
      relations: ['user', 'files'],
    });

    return plainToInstance(MessageDto, messages);
  }

  async editMessage(userId: number, model: EditMessageModel) {
    const message = await this.messagesRepository.findOne({
      where: { messageId: model.messageId },
      relations: ['user', 'files'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.user.userId !== userId) {
      throw new ForbiddenException("You can't  edit this messages");
    }

    if (model.fileIds !== undefined && model.fileIds !== null) {
      message.files = await this.filesRepository.findBy({
        id: In(model.fileIds),
      });

      const oldFiles = await this.filesRepository.findBy({
        message: message,
      });

      const fileIdsToDetach = oldFiles
        .filter((f) => !model.fileIds.includes(f.id))
        .map((f) => f.id);

      if (fileIdsToDetach.length > 0) {
        await this.filesRepository
          .createQueryBuilder()
          .update(FileAttachment)
          .set({ message: null })
          .whereInIds(fileIdsToDetach)
          .execute();
      }
    }

    message.message = model.newMessage;
    const updateMessage = await this.messagesRepository.save(message);

    return plainToInstance(MessageDto, updateMessage);
  }

  async deleteMessage(messageId: number, userId: number) {
    const message = await this.messagesRepository.findOne({
      where: { messageId: messageId },
      relations: ['user'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.user.userId !== userId) {
      throw new ForbiddenException("You can't  delete this messages");
    }

    return await this.messagesRepository.remove(message);
  }
}
