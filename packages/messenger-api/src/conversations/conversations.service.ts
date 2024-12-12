import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../domain/entities/conversation.entity';
import { plainToInstance } from 'class-transformer';
import { ConversationDto } from 'src/common/dto/conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
  ) {}

  async createOrGetConversation(
    user1Id: number,
    user2Id: number,
  ): Promise<Conversation> {
    let conversation = await this.conversationsRepository.findOne({
      where: [
        { user1: { userId: user1Id }, user2: { userId: user2Id } },
        { user1: { userId: user2Id }, user2: { userId: user1Id } },
      ],
    });

    if (!conversation) {
      conversation = this.conversationsRepository.create({
        user1: { userId: user1Id },
        user2: { userId: user2Id },
      });
      await this.conversationsRepository.save(conversation);
    }
    return conversation;
  }

  async getConversation(conversationId: number) {
    const conversation = await this.conversationsRepository.findOne({
      where: { conversationId },
      relations: ['user1', 'user2'],
    });

    if (!conversation) {
      throw new NotFoundException();
    }

    return plainToInstance(ConversationDto, conversation);
  }
}
