// 共用的管理校验。文件名以 _ 开头且不导出 onRequest* 处理器，
// 因此 Pages 不会把它变成一个路由。
export async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// 定长比较，避免按字符提前返回泄露信息
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// 令牌 = 初始化时设置的管理密码；比对 SHA-256(admin_salt + 令牌) 与 admin_hash
export async function verifyAdmin(request, env) {
  const token = request.headers.get('X-Admin-Token') ?? ''
  if (!env.DB || !token) return false
  try {
    const salt = await env.DB.prepare("SELECT value FROM settings WHERE key = 'admin_salt'").first()
    const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'admin_hash'").first()
    if (!salt || !row) return false
    return timingSafeEqual(await sha256Hex(salt.value + token), row.value)
  } catch {
    return false
  }
}

export function forbidden() {
  return Response.json({ error: 'forbidden' }, { status: 403 })
}

// 未绑定 D1 时给前端一个能识别的信号，而不是裸 500
export function noDb() {
  return Response.json({ error: 'no_db' }, { status: 503 })
}
