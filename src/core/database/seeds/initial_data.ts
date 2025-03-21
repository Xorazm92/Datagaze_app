import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Truncate all tables
  await knex('license_usage_logs').del();
  await knex('license_assignments').del();
  await knex('licenses').del();
  await knex('products').del();
  await knex('computer_monitoring_logs').del();
  await knex('installed_applications').del();
  await knex('computers').del();
  await knex('ssh_sessions').del();
  await knex('ssh_connection_logs').del();
  await knex('ssh_servers').del();
  await knex('admin').del();

  // Insert admin users
  const adminUsers = await knex('admin')
    .insert([
      {
        username: 'super_admin',
        email: 'super@example.com',
        password: await bcrypt.hash('Admin@123', 10),
        role: 'super_admin',
      },
      {
        username: 'admin_user',
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin@456', 10),
        role: 'admin',
      },
    ])
    .returning('*');

  // Insert computers
  const computers = await knex('computers')
    .insert([
      {
        name: 'Engineering-PC-001',
        ip_address: '192.168.1.201',
        mac_address: '00:1B:44:11:3A:B7',
        os_type: 'Windows',
        os_version: 'Windows 10 Pro',
        status: 'online',
        last_seen: knex.fn.now(),
      },
      {
        name: 'Design-PC-001',
        ip_address: '192.168.1.202',
        mac_address: '00:1B:44:11:3A:B8',
        os_type: 'macOS',
        os_version: 'macOS Monterey',
        status: 'online',
        last_seen: knex.fn.now(),
      },
      {
        name: 'Dev-Laptop-001',
        ip_address: '192.168.1.203',
        mac_address: '00:1B:44:11:3A:B9',
        os_type: 'Linux',
        os_version: 'Ubuntu 22.04 LTS',
        status: 'offline',
        last_seen: knex.raw("NOW() - INTERVAL '2 hours'"),
      },
    ])
    .returning('*');

  // Insert products
  const products = await knex('products')
    .insert([
      {
        name: 'Adobe Creative Cloud',
        vendor: 'Adobe',
        version: '2024',
        type: 'software',
      },
      {
        name: 'Microsoft Office',
        vendor: 'Microsoft',
        version: '2024',
        type: 'software',
      },
      {
        name: 'AutoCAD',
        vendor: 'Autodesk',
        version: '2024',
        type: 'software',
      },
    ])
    .returning('*');

  // Insert licenses
  const licenses = await knex('licenses')
    .insert([
      {
        product_id: products[0].id,
        license_key: 'ADOBE-XXXX-YYYY-ZZZZ',
        type: 'subscription',
        seats: 10,
        start_date: knex.fn.now(),
        expiry_date: knex.raw("NOW() + INTERVAL '1 year'"),
        status: 'active',
      },
      {
        product_id: products[1].id,
        license_key: 'MS-XXXX-YYYY-ZZZZ',
        type: 'perpetual',
        seats: 50,
        start_date: knex.fn.now(),
        status: 'active',
      },
      {
        product_id: products[2].id,
        license_key: 'ACAD-XXXX-YYYY-ZZZZ',
        type: 'subscription',
        seats: 5,
        start_date: knex.fn.now(),
        expiry_date: knex.raw("NOW() + INTERVAL '6 months'"),
        status: 'active',
      },
    ])
    .returning('*');

  // Insert installed applications
  await knex('installed_applications').insert([
    {
      computer_id: computers[0].id,
      name: 'Adobe Creative Cloud',
      version: '2024',
      install_date: knex.fn.now(),
      license_key: licenses[0].license_key,
      status: 'active',
    },
    {
      computer_id: computers[1].id,
      name: 'Microsoft Office',
      version: '2024',
      install_date: knex.fn.now(),
      license_key: licenses[1].license_key,
      status: 'active',
    },
    {
      computer_id: computers[2].id,
      name: 'AutoCAD',
      version: '2024',
      install_date: knex.fn.now(),
      license_key: licenses[2].license_key,
      status: 'active',
    },
  ]);

  // Insert license assignments
  await knex('license_assignments').insert([
    {
      license_id: licenses[0].id,
      computer_id: computers[0].id,
      assigned_by: adminUsers[0].id,
    },
    {
      license_id: licenses[1].id,
      computer_id: computers[1].id,
      assigned_by: adminUsers[0].id,
    },
    {
      license_id: licenses[2].id,
      computer_id: computers[2].id,
      assigned_by: adminUsers[1].id,
    },
  ]);

  // Insert computer monitoring logs
  await knex('computer_monitoring_logs').insert([
    {
      computer_id: computers[0].id,
      cpu_usage: 45.5,
      memory_usage: 65.2,
      disk_usage: 78.3,
      network_speed: 100,
    },
    {
      computer_id: computers[1].id,
      cpu_usage: 32.1,
      memory_usage: 48.7,
      disk_usage: 55.4,
      network_speed: 150,
    },
    {
      computer_id: computers[2].id,
      cpu_usage: 12.3,
      memory_usage: 35.8,
      disk_usage: 42.1,
      network_speed: 80,
    },
  ]);

  // Insert license usage logs
  await knex('license_usage_logs').insert([
    {
      license_id: licenses[0].id,
      computer_id: computers[0].id,
      action: 'activated',
      details: 'Initial activation',
    },
    {
      license_id: licenses[1].id,
      computer_id: computers[1].id,
      action: 'activated',
      details: 'Initial activation',
    },
    {
      license_id: licenses[2].id,
      computer_id: computers[2].id,
      action: 'activated',
      details: 'Initial activation',
    },
  ]);
}
