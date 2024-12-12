import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../domain/entities/user.entity';
import { Message } from '../domain/entities/message.entity';
import { Conversation } from '../domain/entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Conversation])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
