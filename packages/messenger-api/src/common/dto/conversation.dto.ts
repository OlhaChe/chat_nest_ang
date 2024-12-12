import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { MessageDto } from './message.dto';

@Exclude()
export class ConversationDto {
  @Expose()
  @ApiProperty()
  conversationId: number;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty()
  user1: UserDto;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty()
  user2: UserDto;
}

@Exclude()
export class ConversationDtoWithMessage {
  @Expose()
  @ApiProperty()
  conversationId: number;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty()
  user1: UserDto;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty()
  user2: UserDto;

  @Expose()
  @Type(() => MessageDto)
  @ApiProperty()
  lastMessage: MessageDto;
}
