import { Controller, Get, UseGuards, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserDto } from 'src/common/dto/user.dto';
import { ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: UserDto,
    isArray: true,
  })
  findAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('without-conversation')
  @ApiResponse({
    status: 200,
    description:
      'List of users that don`t have a conversation with current user',
    type: UserDto,
    isArray: true,
  })
  getUsersWithoutChat(@Req() req, @Query('searchQuery') searchQuery?: string) {
    return this.usersService.getUserWithoutActiveConversation(
      req.user.id,
      searchQuery,
    );
  }

  @Get('user-conversation')
  @ApiResponse({
    status: 200,
    description: 'List of users that HAVE a conversation with current user',
    type: UserDto,
    isArray: true,
  })
  getUsersWithChat(@Req() req) {
    return this.usersService.getUsersConversation(req.user.id);
  }
}
