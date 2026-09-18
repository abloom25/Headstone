<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdmin } from '../admin'
import PageScene from '../components/PageScene.vue'
import { timeoutSignal } from '../http'

const route = useRoute()
const router = useRouter()
const { isAdmin, setToken, clearToken } = useAdmin()

const password = ref('')
const error = ref('')
const busy = ref(false)

async function submit() {
  if (!password.value) {
    error.value = '输入管理密码。'
    return
  }
  error.value = ''
  busy.value = true
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'X-Admin-Token': password.value },
      signal: timeoutSignal(10000),
    })
    if (!res.ok) {
      error.value = '密码不对。'
      return
    }
    setToken(password.value)
    password.value = ''
    // 只接受站内路径，挡掉 //evil.com 这类开放重定向
    const redirect = String(route.query.redirect ?? '/bei')
    router.push(/^\/[^/]/.test(redirect) ? redirect : '/bei')
  } catch {
    error.value = '网络出错了，请重试。'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <PageScene ghost="锁">
    <template #art>
      <svg class="art" viewBox="20 40 280 300">
        <g
          fill="none"
          stroke="#cfcfcf"
          stroke-width="1.3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <defs>
            <path
              id="lock-sparkle"
              d="M 0 -7 C 1 -2 2 -1 7 0 C 2 1 1 2 0 7 C -1 2 -2 1 -7 0 C -2 -1 -1 -2 0 -7 Z"
            />
            <filter id="rough-lock" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.055"
                numOctaves="3"
                seed="7"
                result="n"
              />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
            </filter>
          </defs>

          <!-- 飘着的钥匙：手绘抖边 -->
          <g filter="url(#rough-lock)">
            <g transform="translate(58 152) rotate(-14)">
              <g class="drift">
                <circle cx="0" cy="0" r="7.5" />
                <circle cx="0" cy="0" r="3" opacity="0.45" />
                <path d="M 7.5 0 L 38 0" />
                <path d="M 27 0 L 27 7" />
                <path d="M 34 0 L 34 5.5" />
              </g>
            </g>
            <g transform="translate(252 206) rotate(12) scale(0.72)" opacity="0.55">
              <g class="drift d2">
                <circle cx="0" cy="0" r="7.5" />
                <path d="M 7.5 0 L 38 0" />
                <path d="M 27 0 L 27 7" />
                <path d="M 34 0 L 34 5.5" />
              </g>
            </g>
          </g>

          <!-- 锁：手绘凿刻感 -->
          <g filter="url(#rough-lock)">
            <path d="M 130 194 L 130 162 A 30 30 0 0 1 190 162 L 190 194" opacity="0.85" />
            <rect x="112" y="192" width="96" height="104" rx="7" opacity="0.9" />
            <path d="M 112 210 L 208 210" opacity="0.28" />
            <circle cx="160" cy="236" r="7.5" opacity="0.8" />
            <path d="M 160 243 L 155 264 L 165 264 Z" opacity="0.65" />
          </g>

          <!-- 星点 -->
          <g fill="#e8e8e8" stroke="none">
            <use class="star s1" href="#lock-sparkle" transform="translate(66 80)" />
            <use class="star s2" href="#lock-sparkle" transform="translate(266 110) scale(0.68)" />
            <circle cx="40" cy="238" r="1" opacity="0.35" />
            <circle cx="286" cy="266" r="1" opacity="0.3" />
            <circle cx="152" cy="56" r="1.1" opacity="0.35" />
          </g>

          <!-- 地面与小草：同一份手绘感 -->
          <g filter="url(#rough-lock)">
            <path d="M 70 314 Q 160 304 250 314" opacity="0.4" />
            <path d="M 44 321 Q 160 309 276 321" opacity="0.22" />
            <path d="M 92 314 q -3 -8 -1 -12" opacity="0.4" />
            <path d="M 230 315 q 4 -8 2 -12" opacity="0.4" />
          </g>
        </g>
      </svg>
    </template>

    <p class="title">管理登录</p>
    <p class="en">Admin</p>

    <template v-if="isAdmin">
      <p class="counter">已解锁 · 愿与言可增删</p>
      <form class="addbar" @submit.prevent="clearToken">
        <button type="submit">登出</button>
      </form>
    </template>
    <form v-else class="addbar" @submit.prevent="submit">
      <input
        v-model="password"
        type="password"
        placeholder="管理密码"
        autocomplete="current-password"
      />
      <button type="submit" :disabled="busy">{{ busy ? '验证中…' : '进' }}</button>
    </form>

    <p v-if="error" class="muterr">{{ error }}</p>
    <p class="back"><RouterLink to="/bei">← 回到碑前</RouterLink></p>
  </PageScene>
</template>

<style scoped>
/* 页面独有：右下角的返回链接 */
.back {
  margin: 2.6vh 0 0;
  font-size: 11px;
  letter-spacing: 0.2em;
}

.back a {
  color: #8a8a8a;
  text-decoration: none;
  transition: color 0.3s;
}

.back a:hover {
  color: #d0d0d0;
}

@media (max-width: 820px) {
  .back {
    margin-bottom: 6vh;
  }
}
</style>
