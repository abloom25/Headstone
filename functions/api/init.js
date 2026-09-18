// 首次初始化：创建数据表 + 设置管理密码（只在空库时可用）
import { sha256Hex } from './_lib/admin.js'

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.DB) {
    return Response.json({ error: 'no_db' }, { status: 500 })
  }

  const body = await request.json().catch(() => ({}))
  const password = String(body?.password ?? '')

  if (password.length < 6) {
    return Response.json({ error: 'weak_password' }, { status: 400 })
  }

  try {
    // 空库自举：按需建表
    await env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)',
    ).run()
    await env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS voices (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT '', text TEXT NOT NULL, created_at INTEGER NOT NULL, ip TEXT NOT NULL DEFAULT '')",
    ).run()
    await env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS wishes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL)',
    ).run()

    // 已初始化过则拒绝（防止重复设置）
    const existing = await env.DB.prepare(
      "SELECT value FROM settings WHERE key = 'admin_hash'",
    ).first()
    if (existing) {
      return Response.json({ error: 'already_initialized' }, { status: 409 })
    }

    // SHA-256(盐 + 密码)，盐随机生成一并入库
    const salt = [...crypto.getRandomValues(new Uint8Array(16))]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    const hash = await sha256Hex(salt + password)

    await env.DB.prepare(
      "INSERT INTO settings (key, value) VALUES ('admin_salt', ?), ('admin_hash', ?)",
    )
      .bind(salt, hash)
      .run()

    return Response.json({ ok: true })
  } catch (err) {
    console.error('init failed', err)
    return Response.json({ error: 'init_failed' }, { status: 500 })
  }
}
