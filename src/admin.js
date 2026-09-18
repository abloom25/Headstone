// 管理会话：无任何界面入口。
// 想开启管理能力，在浏览器控制台执行（令牌 = 服务端的 ADMIN_TOKEN）：
//   localStorage.setItem('rip.admin', '你的令牌')
// 清除：localStorage.removeItem('rip.admin')
import { computed, ref } from 'vue'

const KEY = 'rip.admin'
const token = ref(localStorage.getItem(KEY) || '')

export function useAdmin() {
  const isAdmin = computed(() => Boolean(token.value))

  function authHeaders() {
    return token.value ? { 'X-Admin-Token': token.value } : {}
  }

  return { isAdmin, authHeaders }
}
