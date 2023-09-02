import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

import { UrlInterface } from './interfaces';
import { ShortenUrl } from './entities';
import { AVAILABLE_SYMBOLS, REDIS_URLS, SYMBOLS_LENGTH } from './constants';

import { config } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
config();

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(ShortenUrl)
    private readonly shortenUrlRepository: Repository<ShortenUrl>,
    @Inject(REDIS_URLS) private readonly redisUrls: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.populateRedisFromDb();
  }

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

  async createUrl(url: string, authToken?: string): Promise<ShortenUrl> {
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

    if (authToken) {
      const user = this.verifyToken(authToken);
      newUrl.owner = user;
    }

    const redisValue = {
      u: url,
      a: newUrl.owner ? 1 : 0,
    };
    this.redisUrls.set(newUrl.shorten_url, JSON.stringify(redisValue));

    return await this.shortenUrlRepository.save(newUrl);
  }

  async getUserUrls(userId: number): Promise<ShortenUrl[]> {
    return await this.shortenUrlRepository.find({
      where: { owner: { id: userId } },
    });
  }

  async redirect(shortenUrl: string): Promise<UrlInterface> {
    const rawRedisValue = await this.redisUrls.get(shortenUrl);

    if (!rawRedisValue) {
      throw new NotFoundException("Shorten url doesn't exist");
    }

    const parsedRedisValue = JSON.parse(rawRedisValue);

    if (parsedRedisValue.a === 1) {
      this.updateUsageCount(shortenUrl);
    }

    let returnedUrl = parsedRedisValue.u;
    if (
      !returnedUrl.startsWith('http://') &&
      !returnedUrl.startsWith('https://')
    ) {
      returnedUrl = 'https://' + returnedUrl;
    }

    return { url: returnedUrl };
  }

  private async updateUsageCount(shortenUrl: string) {
    const existedUrl = await this.shortenUrlRepository.findOne({
      where: { shorten_url: shortenUrl },
    });

    if (!existedUrl) {
      return;
    }

    existedUrl.usage_count += 1;
    this.shortenUrlRepository.save(existedUrl);
  }

  private async populateRedisFromDb() {
    const allUrls = await this.shortenUrlRepository.find({
      relations: ['owner'],
    });
    if (!allUrls.length) {
      return;
    }

    const redisObj = {};
    for (const url of allUrls) {
      redisObj[url.shorten_url] = JSON.stringify({
        u: url.full_url,
        a: url.owner ? 1 : 0,
      });
    }

    await this.redisUrls.mset(redisObj);
  }

  private verifyToken(authHeader: string) {
    const token = authHeader.split(' ')[1];

    try {
      const user = this.jwtService.verify(token);
      return user;
    } catch (e) {
      return null;
    }
  }
}
