// 留言：公开可读可写。
// 防刷：同 IP 60 秒一条、24 小时最多 5 条；名字/内容带链接直接拒收；
// 蜜罐字段被机器人填写时假装成功但不入库。
import { noDb } from './_lib/admin.js'

const RATE_WINDOW_MS = 60_000
const DAILY_LIMIT = 5
const DAY_MS = 86_400_000

function clean(value, max) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function hasLink(value) {
  return /https?:\/\/|www\./i.test(value)
}

export async function onRequestGet(context) {
  const { env } = context
  if (!env.DB) return noDb()
  // 列表封顶 200 条，但计数要给全量，否则页面上的数字会永远停在 200
  const [list, total] = await env.DB.batch([
    env.DB.prepare('SELECT id, name, text, created_at FROM voices ORDER BY id DESC LIMIT 200'),
    env.DB.prepare('SELECT COUNT(*) AS n FROM voices'),
  ])
  return Response.json({
    voices: list.results.map((r) => ({ id: r.id, name: r.name, text: r.text, ts: r.created_at })),
    total: total.results[0]?.n ?? 0,
  })
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.DB) return noDb()
  const body = await request.json().catch(() => ({}))

  // 蜜罐：正常用户看不到这个输入框；机器人填了就假装成功，但不入库
  if (String(body?.website ?? '').trim().length > 0) {
    return Response.json({ ok: true, skipped: true })
  }

  const name = clean(body?.name, 12)
  const text = clean(body?.text, 60)

  if (!text) {
    return Response.json({ error: 'empty' }, { status: 400 })
  }
  if (hasLink(name) || hasLink(text)) {
    return Response.json({ error: 'link' }, { status: 400 })
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  const now = Date.now()
  const stat = await env.DB.prepare(
    `SELECT
       SUM(CASE WHEN created_at > ?1 THEN 1 ELSE 0 END) AS recent,
       SUM(CASE WHEN created_at > ?2 THEN 1 ELSE 0 END) AS day
     FROM voices WHERE ip = ?3`,
  )
    .bind(now - RATE_WINDOW_MS, now - DAY_MS, ip)
    .first()
  if ((stat?.recent ?? 0) > 0) {
    return Response.json({ error: 'too_fast' }, { status: 429 })
  }
  if ((stat?.day ?? 0) >= DAILY_LIMIT) {
    return Response.json({ error: 'daily_limit' }, { status: 429 })
  }

  const finalName = name || '匿名'
  const res = await env.DB.prepare(
    'INSERT INTO voices (name, text, created_at, ip) VALUES (?, ?, ?, ?)',
  )
    .bind(finalName, text, now, ip)
    .run()
  return Response.json({ id: res.meta.last_row_id, name: finalName, text, ts: now })
}
