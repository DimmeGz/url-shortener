import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from './redis/redis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DB_CONFIG, VALIDATION_SCHEMA } from './config';
import { ShortenUrl, User } from './entities';
import { REDIS_URLS } from './constants';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: VALIDATION_SCHEMA,
    }),
    TypeOrmModule.forRoot(DB_CONFIG),
    TypeOrmModule.forFeature([ShortenUrl, User]),
    RedisModule.register(REDIS_URLS),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
