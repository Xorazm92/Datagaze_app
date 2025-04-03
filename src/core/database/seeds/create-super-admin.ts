import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Truncate all tables
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

  // Insert SSH servers
  const sshServers = await knex('ssh_servers')
    .insert([
      {
        name: 'Production Server 1',
        ip_address: '192.168.1.100',
        port: 22,
        username: 'prod_user',
        auth_type: 'password',
        password: 'encrypted_password_1',
        status: 'online',
        last_checked: knex.fn.now(),
      },
      {
        name: 'Staging Server',
        ip_address: '192.168.1.101',
        port: 2222,
        username: 'stage_user',
        auth_type: 'key',
        private_key:
          '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAn5N8Q...',
        passphrase: 'key_passphrase',
        status: 'online',
        last_checked: knex.fn.now(),
      },
      {
        name: 'Development Server',
        ip_address: '192.168.1.102',
        port: 22,
        username: 'dev_user',
        auth_type: 'password',
        password: 'encrypted_password_2',
        status: 'offline',
        last_checked: knex.fn.now(),
      },
    ])
    .returning('*');

  // Insert SSH connection logs
  await knex('ssh_connection_logs').insert([
    {
      server_id: sshServers[0].id,
      user_id: adminUsers[0].id,
      status: 'success',
      created_at: knex.fn.now(),
    },
    {
      server_id: sshServers[1].id,
      user_id: adminUsers[0].id,
      status: 'success',
      created_at: knex.fn.now(),
    },
    {
      server_id: sshServers[2].id,
      user_id: adminUsers[1].id,
      status: 'failed',
      error_message: 'Connection timeout',
      created_at: knex.fn.now(),
    },
  ]);

  // Insert SSH sessions
  await knex('ssh_sessions').insert([
    {
      server_id: sshServers[0].id,
      user_id: adminUsers[0].id,
      started_at: knex.fn.now(),
      status: 'active',
    },
    {
      server_id: sshServers[1].id,
      user_id: adminUsers[1].id,
      started_at: knex.raw("NOW() - INTERVAL '1 hour'"),
      ended_at: knex.fn.now(),
      status: 'closed',
    },
    {
      server_id: sshServers[2].id,
      user_id: adminUsers[0].id,
      started_at: knex.raw("NOW() - INTERVAL '30 minutes'"),
      ended_at: knex.fn.now(),
      status: 'error',
      error_message: 'Connection lost',
    },
  ]);
}
