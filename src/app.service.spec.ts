import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppService } from './app.service';
// import { AuthService } from './auth/auth.service';
import { ShortenUrl, User } from './entities';
import { REDIS_URLS } from './constants';
import { Connection } from 'typeorm';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(ShortenUrl),
          useValue: {},
        },

        {
          provide: REDIS_URLS,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
