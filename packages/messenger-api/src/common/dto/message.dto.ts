import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { FileDto } from './file.dto';

@Exclude()
export class MessageDto {
  @Expose()
  @ApiProperty()
  messageId: number;

  @Expose({ name: 'user' })
  @Type(() => UserDto)
  @ApiProperty()
  sender: UserDto;

  @Expose({ name: 'message' })
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @Type(() => FileDto)
  @ApiProperty()
  files: FileDto;
}
