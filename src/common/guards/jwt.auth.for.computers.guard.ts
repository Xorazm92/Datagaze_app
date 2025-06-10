import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthForComputersGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let token: string;

    // console.log('ok computers');
    console.log(`[JwtAuthForComputersGuard] Context type: ${context.getType()}`); // Qanday kontekst kelayotganini logga chiqarish
    if (context.getType() === 'ws') {
      // WebSocket connection
      const client = context.switchToWs().getClient();
      console.log('[JwtAuthForComputersGuard] WebSocket client handshake auth:', client.handshake?.auth); // Handshake auth obyektini logga chiqarish
      token = client.handshake?.auth?.token as string;
      console.log('[JwtAuthForComputersGuard] Token from WebSocket:', token); // WebSocket tokenini logga chiqarish
    } else {
      // HTTP request
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      token = authHeader?.split(' ')[1];
    }

    console.log('[JwtAuthForComputersGuard] Extracted token:', token); // Olingan tokenni logga chiqarish
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
            const decoded = verify(token, this.jwtSecret);
      if (context.getType() === 'ws') {
        console.log('[JwtAuthForComputersGuard] WebSocket token verified successfully. Decoded:', decoded); // Muvaffaqiyatli dekodlangan tokenni logga chiqarish
        const client = context.switchToWs().getClient();
        client.computer = decoded;
      } else {
        const request = context.switchToHttp().getRequest();
        request.computer = decoded;
      }
      return true;
    } catch (error) {
      console.error('[JwtAuthForComputersGuard] Token verification failed. Error:', error.message, 'Token used:', token); // Xatolik va ishlatilgan tokenni logga chiqarish
      throw new UnauthorizedException('Invalid token');
    }
  }
}
