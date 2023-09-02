import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

const undefinedFindOne = undefined;
const user = {
  username: 'test',
  password: '123',
  firstName: 'first',
  lastName: 'last',
};
const userLogin = {
  username: 'test',
  password: '123',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secretkey' })],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(undefinedFindOne),
            create: jest.fn().mockReturnValue({ ...user, id: 1 }),
            save: jest.fn().mockReturnValue({ ...user, id: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signup', async () => {
    const res = await service.signup(user);
    expect(res.accessToken).toMatch(/^[0-9,A-Z,a-z,-,.]/);
  });

  it('wrong login', async () => {
    try {
      const res = await service.login(userLogin);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
