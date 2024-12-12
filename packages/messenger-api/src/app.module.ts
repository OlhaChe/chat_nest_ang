import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './common/configs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConversationsModule } from './conversations/conversations.module';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileDeleteTask } from './tasks/file-delete.task';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ScheduleModule.forRoot(),
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: '24h' },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'messangerdb',
      entities: [__dirname + '/domain/entities/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      timezone: 'Z',
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const uploadPath = configService.get<string>('FILE_UPLOAD_PATH');
        const absolutePath = join(
          process.cwd(),
          '..',
          'messenger-api/' + uploadPath,
        );
        return [
          {
            rootPath: absolutePath,
            serveRoot: '/static',
            serveStaticOptions: {
              index: false,
            },
          },
        ];
      },
    }),
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileDeleteTask],
})
export class AppModule {}
