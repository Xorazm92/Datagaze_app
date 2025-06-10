import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('ENCRYPTION_KEY');
    const secretIv = this.configService.get<string>('ENCRYPTION_IV');
    // Debug log for deploy and local
    // eslint-disable-next-line no-console
    console.log('[CryptoService] ENCRYPTION_KEY:', secretKey, 'ENCRYPTION_IV:', secretIv, 'CWD:', process.cwd());

    if (!secretKey || !secretIv) {
      throw new Error('ENCRYPTION_KEY and ENCRYPTION_IV must be defined in .env file');
    }

    this.key = Buffer.from(secretKey, 'hex');
    this.iv = Buffer.from(secretIv, 'hex');
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
