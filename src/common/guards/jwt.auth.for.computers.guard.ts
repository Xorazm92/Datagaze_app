import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { ENV } from 'src/config/env';

@Injectable()
export class JwtAuthForComputersGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        let token: string;
        
        if (context.getType() === 'ws') {
            // WebSocket connection
            const client = context.switchToWs().getClient();
            token = client.handshake?.query?.token as string;
        } else {
            // HTTP request
            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization;
            token = authHeader?.split(' ')[1];
        }

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decoded = verify(token, ENV.JWT_PRIVAT_KEY);
            if (context.getType() === 'ws') {
                const client = context.switchToWs().getClient();
                client.computer = decoded;
            } else {
                const request = context.switchToHttp().getRequest();
                request.computer = decoded;
            }
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}