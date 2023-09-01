import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    try {
      const [, token] = request.headers['authorization'].split(' ');
      const user = this.jwtService.verify(token);

      request.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }
}
