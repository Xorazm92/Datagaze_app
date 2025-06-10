import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CryptoService } from '../../common/services/crypto.service';
import { ProductsService } from '../products/products.service';
import * as ssh2 from 'ssh2';
import { CreateSshDto } from './dto/create-ssh.dto';
// Bu interfeysni keyinroq yaratamiz
// import { IConnectConfig } from './entities/connect.config.interface'; 
// User interfeysini auth modulidan olish kerak bo'ladi
// import { User } from '../users/entities/user.entity';

@Injectable()
export class SshService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly cryptoService: CryptoService,
    private readonly productsService: ProductsService,
  ) {}

  async connectToServerCheck(data: CreateSshDto, user: any): Promise<object> {
    if (data.product_id) {
      // ProductsService orqali mahsulot mavjudligini tekshiramiz
      await this.productsService.findOne(data.product_id);
    }

    const conn = new ssh2.Client();

    const connectionConfig: ssh2.ConnectConfig = {
      host: data.ip,
      port: data.port,
      username: data.username,
    };

    if (data.auth_type === 'password' && data.password) {
      connectionConfig.password = data.password;
    } else if (data.auth_type === 'private_key' && data.private_key) {
      connectionConfig.privateKey = data.private_key;
    } else {
      throw new BadRequestException('Invalid authentication method');
    }

    const connectPromise = new Promise<void>((resolve, reject) => {
      conn.on('ready', () => {
        resolve();
      });

      conn.on('error', (err) => {
        reject(err);
      });

      conn.connect(connectionConfig);
    });

    try {
      await connectPromise;
      const [server] = await this.knex('ssh_servers')
        .insert({
          name: data.name, // 'name' maydonini qo'shamiz
          ip_address: data.ip,
          port: data.port,
          username: data.username,
          auth_type: data.auth_type,
          password: data.password ? this.cryptoService.encrypt(data.password) : null,
          private_key: data.private_key ? this.cryptoService.encrypt(data.private_key) : null,
        })
        .returning('id');

      const [log] = await this.knex('ssh_connection_logs')
        .insert({
          server_id: server.id,
          status: 'success',
          error_message: null,
          user_id: user.id,
        })
        .returning('id');

      conn.end();

      // Hozircha 'products' jadvali yo'qligi sababli bu qismni kommentga olamiz
      // await this.knex('products').where({ id: data.product_id }).update({
      //   server_id: server.id,
      //   is_installed: true,
      // });

      return {
        status: 'success',
        message: 'Connected successfully.',
        session_id: log.id,
        server_id: server.id,
      };
    } catch (err) {
      const [log] = await this.knex('ssh_connection_logs')
        .insert({
          server_id: null,
          status: 'failed',
          error_message: err.message,
          user_id: user.id,
        })
        .returning('id');

      throw new BadRequestException({
        message: err.message,
        session_id: log.id,
      });
    }
  }
}
