import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class FileDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose({ name: 'originalFilename' })
  name: string;

  @Expose({ name: 'filename' })
  @Transform(({ value }) => `/static/${value}`)
  url: string;
}
