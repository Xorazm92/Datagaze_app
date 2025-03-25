
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nest-knexjs';

@Injectable()
export class DlpService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getPolicies() {
    return this.knex('dlp_policies').select('*');
  }

  async createPolicy(policyData: any) {
    return this.knex('dlp_policies').insert(policyData).returning('*');
  }

  async getReports() {
    return this.knex('dlp_reports').select('*');
  }
}
