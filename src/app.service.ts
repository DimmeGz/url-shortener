import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

import { UrlInterface } from './interfaces';
import { ShortenUrl } from './entities';
import { AVAILABLE_SYMBOLS, REDIS_URLS, SYMBOLS_LENGTH } from './constants';

import { config } from 'dotenv';
config();

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ShortenUrl)
    private readonly shortenUrlRepository: Repository<ShortenUrl>,
    @Inject(REDIS_URLS) private readonly redisUrls: Redis,
  ) {}

  private generateRandomString(): string {
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

  async createUrl(url: string): Promise<ShortenUrl> {
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
        full_url: url,
        shorten_url: randomString,
        usage_count: 0,
      });
    }

    return await this.shortenUrlRepository.save(newUrl);
  }

  async redirect(shortenUrl: string): Promise<UrlInterface> {
    const existedUrl = await this.shortenUrlRepository.findOne({
      where: { shorten_url: shortenUrl },
    });

    if (!existedUrl) {
      throw new NotFoundException("Shorten url doesn't exist");
    }

    existedUrl.usage_count += 1;
    this.shortenUrlRepository.save(existedUrl);

    let returnedUrl = '';
    if (
      !existedUrl.full_url.startsWith('http://') ||
      !existedUrl.full_url.startsWith('https://')
    ) {
      returnedUrl = 'https://' + existedUrl.full_url;
    } else {
      returnedUrl = existedUrl.full_url;
    }

    return { url: returnedUrl };
  }
}
