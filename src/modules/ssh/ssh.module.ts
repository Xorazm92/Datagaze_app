import { Module } from '@nestjs/common';
import { SshController } from './ssh.controller';
import { SshService } from './ssh.service';
import { CryptoService } from '../../common/services/crypto.service';
import { ProductsModule } from '../products/products.module';

@Module({
      imports: [ProductsModule],
  controllers: [SshController],
  providers: [SshService, CryptoService],
  exports: [SshService],
})
export class SshModule {}

