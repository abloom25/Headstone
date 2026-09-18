// 管理会话：令牌 = 初始化时设置的管理密码，登录入口在 /login。
// 令牌存在 localStorage 里（关掉浏览器仍然有效），清除请在 /login 页登出。
import { computed, ref } from 'vue'

const KEY = 'rip.admin'

// 隐私模式 / 禁用站点数据时 localStorage 会直接抛错，这里一律吞掉，
// 否则模块求值阶段抛异常会把整个应用带崩（白屏）。
function read() {
  try {
    return localStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}
function write(value) {
  try {
    if (value) localStorage.setItem(KEY, value)
    else localStorage.removeItem(KEY)
  } catch {
    /* 存不下就只在本次会话内有效 */
  }
}

// 模块级单例：所有页面共用同一份登录态，登录后立即全局生效
const token = ref(read())

export function useAdmin() {
  const isAdmin = computed(() => Boolean(token.value))

  function setToken(value) {
    token.value = value || ''
    write(token.value)
  }
  function clearToken() {
    setToken('')
  }
  function authHeaders() {
    return token.value ? { 'X-Admin-Token': token.value } : {}
  }

  return { isAdmin, setToken, clearToken, authHeaders }
}
