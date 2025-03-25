import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class DlpService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async getPolicies() {
    return this.knex('dlp_policies').select('*');
  }

  async createPolicy(policyData: any) {
    return this.knex('dlp_policies').insert(policyData).returning('*');
  }

  async getReports() {
    return this.knex('dlp_reports').select('*');
  }

  async getStatistics() {
    const totalPolicies = await this.knex('dlp_policies').count('id').first();
    const activePolicies = await this.knex('dlp_policies').where('is_active', true).count('id').first();
    const totalIncidents = await this.knex('dlp_reports').count('id').first();

    return {
      totalPolicies: parseInt(totalPolicies.count as string),
      activePolicies: parseInt(activePolicies.count as string),
      totalIncidents: parseInt(totalIncidents.count as string),
    };
  }

  async getPolicy(id: string) {
    return this.knex('dlp_policies').where('id', id).first();
  }

  async updatePolicy(id: string, policyData: any) {
    return this.knex('dlp_policies')
      .where('id', id)
      .update(policyData)
      .returning('*');
  }

  async deletePolicy(id: string) {
    await this.knex('dlp_policies').where('id', id).delete();
    return { success: true };
  }

  async togglePolicy(id: string) {
    const policy = await this.getPolicy(id);
    return this.knex('dlp_policies')
      .where('id', id)
      .update({ is_active: !policy.is_active })
      .returning('*');
  }
}

