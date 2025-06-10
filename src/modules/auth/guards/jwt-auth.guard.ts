import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('JWT Auth Error:', info?.message || err?.message);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}