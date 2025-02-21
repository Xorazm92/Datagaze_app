import { Module } from '@nestjs/common';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';

@Module({
  controllers: [LicensesController],
  providers: [LicensesService],
  exports: [LicensesService],
})
export class LicensesModule {}
