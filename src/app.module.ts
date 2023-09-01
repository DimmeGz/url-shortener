import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DB_CONFIG, VALIDATION_SCHEMA } from './config';
import { ShortenUrl } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: VALIDATION_SCHEMA }),
    TypeOrmModule.forRoot(DB_CONFIG),
    TypeOrmModule.forFeature([ShortenUrl]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
