import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { VALIDATION_SCHEMA } from './config';

@Module({
  imports: [ConfigModule.forRoot({ validationSchema: VALIDATION_SCHEMA })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
