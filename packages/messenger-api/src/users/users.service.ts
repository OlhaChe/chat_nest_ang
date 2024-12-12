import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { Conversation } from '../domain/entities/conversation.entity';
import { Message } from '../domain/entities/message.entity';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/common/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async getAllUsers() {
    return plainToInstance(UserDto, await this.usersRepository.find());
  }

  async getUserWithoutActiveConversation(
    currentUserId: number,
    searchQuery?: string,
  ) {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.userId != :currentUserId', { currentUserId })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(Conversation, 'conversation')
          .where(
            '(conversation.user1_id = user.userId AND conversation.user2_id = :currentUserId) OR (conversation.user2_id = user.userId AND conversation.user1_id = :currentUserId)',
          )
          .getQuery();
        return `NOT EXISTS ${subQuery}`;
      })
      .andWhere('user.userName LIKE :searchQuery', {
        searchQuery: `${searchQuery || ''}%`,
      })
      .getMany();
    return plainToInstance(UserDto, users);
  }

  async getUsersConversation(currentUserId: number) {
    const conversations = await this.conversationRepository.find({
      where: [
        { user1: { userId: currentUserId } },
        { user2: { userId: currentUserId } },
      ],
      relations: ['user1', 'user2'],
      order: { createdAt: 'DESC' },
    });

    const userIdsWithConversations = new Set<number>();
    const conversationMap = new Map<number, Conversation>();
    conversations.forEach((conversation) => {
      const otherUserId =
        conversation.user1.userId === currentUserId
          ? conversation.user2.userId
          : conversation.user1.userId;

      userIdsWithConversations.add(otherUserId);
      conversationMap.set(otherUserId, conversation);
    });

    // get last message in chat
    const lastMessages = await Promise.all(
      Array.from(conversationMap.values()).map(async (conversation) => {
        return this.messageRepository.findOne({
          where: {
            conversation: [{ conversationId: conversation.conversationId }],
          },
          order: { createdAt: 'DESC' },
        });
      }),
    );
    const withChats = Array.from(userIdsWithConversations).map(
      (userId, index) => {
        const conversation = conversationMap.get(userId);
        const otherUser =
          conversation.user1.userId === currentUserId
            ? conversation.user2
            : conversation.user1;

        return {
          user: otherUser,
          lastMessage: lastMessages[index] || null,
        };
      },
    );
    const allUsers = await this.usersRepository.find();
    const withoutChats = allUsers.filter(
      (user) =>
        !userIdsWithConversations.has(user.userId) &&
        user.userId !== currentUserId,
    );
    return { withChats, withoutChats };
  }
}
