import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortenUrl, User } from '../src/entities';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

const registerUser = {
  username: 'test',
  password: '123',
  firstName: 'first',
  lastName: 'last',
};

const postUrl = {
  url: 'example.com',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          useFactory: () => ({
            secret: 'secret',
          }),
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          entities: [User, ShortenUrl],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, ShortenUrl]),
        AppModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let accessToken: string;
  it('signup', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(registerUser)
      .expect(201);
    accessToken = res.body.accessToken;
  });

  let redirectUrl: string;
  it('createUrl', async () => {
    const res = await request(app.getHttpServer())
      .post('/create-url')
      .send(postUrl)
      .expect(201);
    redirectUrl = res.body.shorten_url;
  });

  it('redirect', async () => {
    await request(app.getHttpServer()).get(`/${redirectUrl}`).expect(302);
  });

  afterAll(async () => {
    await app.close();
  });
});
