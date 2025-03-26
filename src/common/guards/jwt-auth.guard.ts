// import {
//   Injectable,
//   ExecutionContext,
//   UnauthorizedException,
//   Logger,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   private readonly logger = new Logger(JwtAuthGuard.name);

//   async canActivate(context: ExecutionContext): Promise<any> {
//     try {
//       const request = context.switchToHttp().getRequest();
//       this.logger.log('Headers: ' + JSON.stringify(request.headers)); // Token bor-yo‘qligini tekshirish

//       const isAuthenticated = await super.canActivate(context);
//       this.logger.log('Auth Status: ' + isAuthenticated);

//       if (!isAuthenticated) {
//         throw new UnauthorizedException(
//           'Foydalanuvchi autentifikatsiyadan o‘tmadi',
//         );
//       }

//       return isAuthenticated;
//     } catch (error) {
//       this.logger.error('Auth Error: ' + error.message);
//       throw new UnauthorizedException('Token noto‘g‘ri yoki mavjud emas');
//     }
//   }

//   handleRequest(err, user, info) {
//     if (err || !user) {
//       this.logger.error('JWT Auth Failed: ' + JSON.stringify(info));
//       throw new UnauthorizedException(
//         'Token noto‘g‘ri yoki mavjud emas',
//       );
//     }
//     return user;
//   }
// }

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('No authorization header');
      }

      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer') {
        throw new UnauthorizedException('Invalid token type');
      }

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const isAuthenticated = await super.canActivate(context);
      return isAuthenticated;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Authentication failed');
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException(
        info?.message || 'Invalid token or user not found'
      );
    }
    return user;
  }
}
