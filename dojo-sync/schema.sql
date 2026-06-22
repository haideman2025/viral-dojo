-- Viral Dojo sync — D1 schema
-- Áp dụng: wrangler d1 execute dojo --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS accounts (
  code       TEXT PRIMARY KEY,            -- access code = bearer token (admin cấp)
  name       TEXT,                        -- tên hiển thị
  blob       TEXT,                        -- workspace JSON {v,activeId,projects} (NULL tới push đầu)
  version    INTEGER NOT NULL DEFAULT 0,  -- tăng mỗi push; nền của conflict detection (CAS)
  created_at TEXT,
  updated_at TEXT
);
