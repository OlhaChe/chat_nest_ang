import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterModel } from './model/register.model';
import { LoginModel } from './model/login.model';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtResponse } from './model/jwt.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiResponse({
    description: 'The user has been logged in.',
    type: JwtResponse,
  })
  @ApiBadRequestResponse({ description: 'Wrong or invalid credentials' })
  signIn(@Body() signInDto: LoginModel) {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  @ApiCreatedResponse({
    description: 'The user has been created and logged in.',
    type: JwtResponse,
  })
  @ApiBadRequestResponse({ description: 'Wrong credentials' })
  async signUp(@Body() register: RegisterModel) {
    return this.authService.register(register);
  }
}
