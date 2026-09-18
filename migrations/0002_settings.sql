-- 0002: 管理密码等设置项（初始化时写入 admin_salt / admin_hash）
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
