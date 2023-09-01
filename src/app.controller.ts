import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateShortenUrlDTO, UrlParamDTO } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-url')
  createUrl(
    @Body() createUrlDTO: CreateShortenUrlDTO,
    @Headers('Authorization') authToken?: string,
  ) {
    return this.appService.createUrl(createUrlDTO.url, authToken);
  }

  @Get(':shortenUrl')
  @Redirect()
  async redirect(@Param() { shortenUrl }: UrlParamDTO) {
    return this.appService.redirect(shortenUrl);
  }
}
