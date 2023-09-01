import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateShortenUrlDTO, UrlParamDTO } from './dto';
import { JwtGuard } from './auth/guards';
import { UrlsRequest } from './interfaces';

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

  @Get('user-urls')
  @UseGuards(JwtGuard)
  getUserUrls(@Req() req: UrlsRequest) {
    return this.appService.getUserUrls(req.user.id);
  }

  @Get(':shortenUrl')
  @Redirect()
  async redirect(@Param() { shortenUrl }: UrlParamDTO) {
    return this.appService.redirect(shortenUrl);
  }
}
