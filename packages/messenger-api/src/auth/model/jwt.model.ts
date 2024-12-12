import { ApiProperty } from '@nestjs/swagger';

export class JwtResponse {
  @ApiProperty()
  accessToken: string;
}
