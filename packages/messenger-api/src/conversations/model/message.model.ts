import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MessageModel {
  @ApiProperty()
  @IsNotEmpty()
  conversationId: number;
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  fileIds: number[];
}
