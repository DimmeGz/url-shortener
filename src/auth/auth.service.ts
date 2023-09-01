import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoginDto, SignupDto } from './dto';
import { User } from 'src/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  createAccessToken(userId: number): { accessToken: string } {
    return { accessToken: this.jwtService.sign({ id: userId }) };
  }

  async signup(newUser: SignupDto): Promise<{ accessToken: string }> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: newUser.username },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with username ${newUser.username} already exists`,
      );
    }

    const user = this.usersRepository.create({
      username: newUser.username,
      password: await argon2.hash(newUser.password),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });
    this.usersRepository.save(user);

    return this.createAccessToken(user.id);
  }

  async login(user: LoginDto): Promise<{ accessToken: string }> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { username: user.username },
      });

      if (!user) {
        throw new NotFoundException(
          'User with such username and password not found',
        );
      }

      const passwordMatch = await argon2.verify(
        existingUser.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new NotFoundException(
          'User with such username and password not found',
        );
      }

      return this.createAccessToken(existingUser.id);
    } catch (e) {
      throw new UnauthorizedException(
        'Username or password may be incorrect. Please try again',
      );
    }
  }
}
