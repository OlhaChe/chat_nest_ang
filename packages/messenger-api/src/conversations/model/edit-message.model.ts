import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EditMessageModel {
  @ApiProperty()
  @IsNotEmpty()
  conversationId: string;
  @ApiProperty()
  @IsNotEmpty()
  messageId: number;
  @ApiProperty()
  newMessage: string;
  @ApiProperty()
  fileIds: number[];
}
