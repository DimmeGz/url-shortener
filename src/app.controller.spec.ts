import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';

const createUrlBody = {
  url: 'https://google.com',
};
const createdUrlResponse = {
  shorten_url: 'sONEwSR',
  full_url: 'https://google.com',
  usage_count: 0,
  id: 1,
};

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            createUrl: jest.fn().mockReturnValue(createdUrlResponse),
            redirect: jest.fn().mockReturnValue(createUrlBody),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return createdUrlResponse', () => {
      expect(appController.createUrl(createUrlBody)).toBe(createdUrlResponse);
    });

    it('should return redirect url', async () => {
      expect(await appController.redirect({ shortenUrl: 'sONEwSR' })).toBe(
        createUrlBody,
      );
    });
  });
});
