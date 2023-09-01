import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateShortenUrlDTO, UrlParamDTO } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-url')
  createUrl(@Body() createUrlDTO: CreateShortenUrlDTO) {
    return this.appService.createUrl(createUrlDTO.url);
  }

  @Get(':shortenUrl')
  @Redirect()
  async redirect(@Param() { shortenUrl }: UrlParamDTO) {
    return this.appService.redirect(shortenUrl);
  }
}
