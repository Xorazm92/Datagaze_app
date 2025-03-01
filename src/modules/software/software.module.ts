import { Module } from '@nestjs/common';
import { databaseConfig } from '../../config/database.config';
import Knex from 'knex';
import { SoftwareService } from './software.service';
import { SoftwareController } from './software.controller';

@Module({
  controllers: [SoftwareController],
  providers: [
    SoftwareService,
    {
      provide: 'KNEX_CONNECTION',
      useValue: Knex({
        client: 'pg',
        connection: {
          host: process.env.DATABASE_HOST,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
        },
      }),
    },
  ],
})
export class SoftwareModule {}
