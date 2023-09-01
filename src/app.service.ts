import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateShortenUrl } from './interfaces';
import { ShortenUrl } from './entities';

import { config } from 'dotenv';
import { AVAILABLE_SYMBOLS, SYMBOLS_LENGTH } from './constants';
config();

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ShortenUrl)
    private readonly shortenUrlRepository: Repository<ShortenUrl>,
  ) {}

  private generateRandomString() {
    let result = '';
    let counter = 0;
    while (counter < +process.env.URL_LENGTH) {
      result += AVAILABLE_SYMBOLS.charAt(
        Math.floor(Math.random() * SYMBOLS_LENGTH),
      );
      counter += 1;
    }
    return result;
  }

  async createUrl(data: CreateShortenUrl) {
    let newUrl: ShortenUrl;
    while (!newUrl) {
      const randomString = this.generateRandomString();
      const existedUrl = await this.shortenUrlRepository.findOne({
        where: { shorten_url: randomString },
      });

      if (existedUrl) {
        continue;
      }

      newUrl = this.shortenUrlRepository.create({
        full_url: data.url,
        shorten_url: randomString,
        usage_count: 0,
      });
    }

    return await this.shortenUrlRepository.save(newUrl);
  }
}
