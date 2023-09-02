import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppService } from './app.service';
// import { AuthService } from './auth/auth.service';
import { ShortenUrl, User } from './entities';
import { REDIS_URLS } from './constants';
import { Connection } from 'typeorm';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

const undefinedFindOne = undefined;
const createdShortenUrl = {
  id: 1,
  full_url: 'example.com',
  shorten_url: 'As3hI3C',
  usage_count: 0,
};

const usersUrls = {
  owner: {
    id: 1,
  },
  full_url: 'example.com',
  shorten_url: 'As3hI3C',
  usage_count: 0,
  id: 1,
};

const redisUrl = JSON.stringify({
  u: 'example.com',
  a: 1,
});

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(ShortenUrl),
          useValue: {
            findOne: jest.fn().mockReturnValue(undefinedFindOne),
            find: jest.fn().mockReturnValue([usersUrls]),
            create: jest.fn().mockReturnValue(createdShortenUrl),
            save: jest.fn().mockReturnValue(createdShortenUrl),
          },
        },

        {
          provide: REDIS_URLS,
          useValue: {
            set: jest.fn(),
            get: jest.fn().mockReturnValue(redisUrl),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test url create', async () => {
    const res = await service.createUrl('some_link');
    expect(res).toEqual(createdShortenUrl);
  });

  it('test urls get', async () => {
    const res = await service.getUserUrls(1);
    expect(res).toEqual([usersUrls]);
  });

  it('test redirect', async () => {
    const res = await service.redirect('As3hI3C');
    expect(res).toEqual({ url: 'https://example.com' });
  });
});
