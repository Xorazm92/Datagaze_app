// import { Injectable, ExecutionContext } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   canActivate(context: ExecutionContext) {

//     let data =  super.canActivate(context);
//     console.log(context);
//     return data
//   }

// }

// import { Injectable, ExecutionContext } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { error, log } from 'console';
// import { Observable } from 'rxjs';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   async canActivate(context: ExecutionContext): Promise<any> {
//     try {
//       const request = context.switchToHttp().getRequest();
//       console.log(context,request.headers)
//       ;
//       const data = await super.canActivate(context);
//       console.log(data);

//       if (!context || !data) {
//         throw new Error('Unauthorized access');
//       }
//       return data;
//     } catch (error) {
//       console.log(error);
//       throw new Error(error);

//     }
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
      console.log('Headers:', request.headers); // Token bor-yo‘qligini tekshirish

      const isAuthenticated = await super.canActivate(context);
      console.log('Auth Status:', isAuthenticated);

      if (!isAuthenticated) {
        throw new UnauthorizedException(
          'Foydalanuvchi autentifikatsiyadan o‘tmadi',
        );
      }

      return isAuthenticated;
    } catch (error) {
      console.error('Auth Error:', error.message);
      throw new UnauthorizedException('Token noto‘g‘ri yoki mavjud emas');
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('JWT Auth Failed:', info);
      throw new UnauthorizedException(
        info || 'Token noto‘g‘ri yoki mavjud emas',
      );
    }
    return user;
  }
}
