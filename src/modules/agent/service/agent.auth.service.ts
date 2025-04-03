import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ENV } from 'src/config/env';

@Injectable()
export class AgentAuthService {
  async generateToken(payload: any): Promise<string> {
    return sign(payload, ENV.JWT_PRIVAT_KEY, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    });
  }
}
