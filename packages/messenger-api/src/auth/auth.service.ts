import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterModel } from './model/register.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { JwtResponse } from './model/jwt.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<JwtResponse> {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { accessToken: this.generateJwtToken(user.userId, user.email) };
    }
    throw new BadRequestException('User email or password is invalid');
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async register(userData: RegisterModel) {
    const existingUserWithEmail = await this.usersRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUserWithEmail) {
      throw new ConflictException('User with this email already exists');
    }

    const existingUserWithUsername = await this.usersRepository.findOne({
      where: { userName: userData.userName },
    });

    if (existingUserWithUsername) {
      throw new ConflictException('User with this username already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.usersRepository.create({
      email: userData.email,
      password: hashedPassword,
      userName: userData.userName,
    });
    const createdUser = await this.usersRepository.save(newUser);

    return {
      accessToken: this.generateJwtToken(createdUser.userId, createdUser.email),
    };
  }

  private generateJwtToken(id: number, email: string) {
    return this.jwtService.sign({
      email,
      id,
    });
  }
}
