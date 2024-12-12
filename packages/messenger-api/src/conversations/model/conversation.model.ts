import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConversationModel {
  @ApiProperty()
  @IsNotEmpty()
  otherUserId: number;
}
