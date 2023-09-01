import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateShortenUrlDTO } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create-url')
  createUrl(@Body() createUrlDTO: CreateShortenUrlDTO) {
    console.log(createUrlDTO);
  }
}
