-- SSH sessions table
CREATE TABLE IF NOT EXISTS ssh_sessions (
  id SERIAL PRIMARY KEY,
  server_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  error_message TEXT,
  FOREIGN KEY (server_id) REFERENCES servers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- SSH connection logs
CREATE TABLE IF NOT EXISTS ssh_connection_logs (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES ssh_sessions(id)
);

-- SSH credentials
CREATE TABLE IF NOT EXISTS ssh_credentials (
  id SERIAL PRIMARY KEY,
  server_id INTEGER NOT NULL,
  username VARCHAR(100) NOT NULL,
  auth_type VARCHAR(20) NOT NULL,
  password VARCHAR(255),
  private_key TEXT,
  passphrase VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (server_id) REFERENCES servers(id)
);

-- License alerts
CREATE TABLE IF NOT EXISTS license_alerts (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Application installation logs
CREATE TABLE IF NOT EXISTS application_logs (
  id SERIAL PRIMARY KEY,
  computer_id INTEGER NOT NULL,
  app_id INTEGER NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (computer_id) REFERENCES computers(id),
  FOREIGN KEY (app_id) REFERENCES installed_applications(id)
);
