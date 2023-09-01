import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateShortenUrlDTO } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-url')
  createUrl(@Body() createUrlDTO: CreateShortenUrlDTO) {
    return this.appService.createUrl(createUrlDTO);
  }
}
