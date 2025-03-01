import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Truncate table
  await knex('software_inventory').del();

  // Insert software inventory
  await knex('software_inventory').insert([
    {
      application_name: 'DLP',
      version: '4.7.2',
      is_installed: false,
      path_to_file: '/files/web_applications/dlp/dlp-4.7.2.exe',
      path_to_icon: '/assets/logo/dlp.png',
    },
    {
      application_name: 'SIEM',
      version: '7.0.1',
      is_installed: true,
      path_to_file: '/files/web_applications/siem/siem-7.0.1.exe',
      path_to_icon: '/assets/logo/siem.png',
    },
    {
      application_name: 'WAF',
      version: '2.1.0',
      is_installed: true,
      path_to_file: '/files/web_applications/waf/waf-2.1.0.exe',
      path_to_icon: '/assets/logo/waf.png',
    }
  ]);
}
