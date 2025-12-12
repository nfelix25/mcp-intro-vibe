export const schema = `
-- Users table (managed by BetterAuth)
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  emailVerified INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  image TEXT
);

-- Sessions table (managed by BetterAuth)
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  expiresAt INTEGER NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

-- Account table (managed by BetterAuth)
CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  expiresAt INTEGER,
  password TEXT,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

-- Verification table (managed by BetterAuth)
CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt INTEGER NOT NULL
);

-- Issues table
CREATE TABLE IF NOT EXISTS issue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL CHECK(length(title) > 0 AND length(title) <= 200),
  description TEXT,
  status TEXT NOT NULL CHECK(status IN ('not_started', 'in_progress', 'done')) DEFAULT 'not_started',
  priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  assigned_user_id TEXT,
  created_by_user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (assigned_user_id) REFERENCES user(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by_user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Tags table
CREATE TABLE IF NOT EXISTS tag (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL COLLATE NOCASE CHECK(length(name) > 0 AND length(name) <= 50),
  color TEXT NOT NULL CHECK(color GLOB '#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]'),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- IssueTag junction table
CREATE TABLE IF NOT EXISTS issue_tag (
  issue_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (issue_id, tag_id),
  FOREIGN KEY (issue_id) REFERENCES issue(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_issue_status ON issue(status);
CREATE INDEX IF NOT EXISTS idx_issue_assigned_user ON issue(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_issue_created_by ON issue(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_issue_created_at ON issue(created_at);
CREATE INDEX IF NOT EXISTS idx_session_userId ON session(userId);
CREATE INDEX IF NOT EXISTS idx_account_userId ON account(userId);
`;

export const seedData = `
-- Insert sample tags
INSERT OR IGNORE INTO tag (name, color) VALUES 
  ('bug', '#ef4444'),
  ('feature', '#8b5cf6'),
  ('enhancement', '#f59e0b'),
  ('documentation', '#6b7280'),
  ('frontend', '#3b82f6'),
  ('backend', '#10b981');
`;
