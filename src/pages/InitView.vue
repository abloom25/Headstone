<script setup>
import { ref } from 'vue'
import { timeoutSignal } from '../http'
import PageScene from '../components/PageScene.vue'

const emit = defineEmits(['done'])
const password = ref('')
const confirm = ref('')
const error = ref('')
const busy = ref(false)

async function submit() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = '密码至少 6 位。'
    return
  }
  if (password.value !== confirm.value) {
    error.value = '两次输入的密码不一致。'
    return
  }
  busy.value = true
  try {
    const res = await fetch('/api/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value }),
      signal: timeoutSignal(10000),
    })
    if (res.status === 409) {
      // 已经初始化过了，直接进入
      emit('done')
      return
    }
    if (!res.ok) {
      const e = await res.json().catch(() => ({}))
      error.value = e.error === 'weak_password' ? '密码至少 6 位。' : '初始化失败，请重试。'
      return
    }
    emit('done')
  } catch {
    error.value = '连接超时或网络出错，请重试。'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <PageScene ghost="始">
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
              id="init-sparkle"
              d="M 0 -7 C 1 -2 2 -1 7 0 C 2 1 1 2 0 7 C -1 2 -2 1 -7 0 C -2 -1 -1 -2 0 -7 Z"
            />
            <filter id="rough-init" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.05"
                numOctaves="3"
                seed="3"
                result="n"
              />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
            </filter>
          </defs>

          <!-- 空白碑石：还没刻上任何字 -->
          <g filter="url(#rough-init)">
            <path
              d="M 80 300 L 80 172 C 80 114 114 86 160 86 C 206 86 240 114 240 172 L 240 300"
              opacity="0.9"
            />
            <path
              d="M 94 300 L 94 174 C 94 124 124 100 160 100 C 196 100 226 124 226 174 L 226 300"
              opacity="0.28"
            />
            <circle cx="160" cy="140" r="8" opacity="0.4" />
            <!-- 待刻的三行，极淡 -->
            <path d="M 122 186 L 198 186" opacity="0.16" />
            <path d="M 130 212 L 190 212" opacity="0.13" />
            <path d="M 130 236 L 190 236" opacity="0.1" />
          </g>

          <!-- 飘着的凿子与锤：手绘抖边 -->
          <g filter="url(#rough-init)">
            <g transform="translate(58 158) rotate(-18)">
              <g class="drift">
                <path d="M 0 0 L 8 0 L 8 26 L 4 34 L 0 26 Z" />
                <path d="M 0 8 L 8 8" opacity="0.4" />
              </g>
            </g>
            <g transform="translate(250 196) rotate(14) scale(0.8)" opacity="0.55">
              <g class="drift d2">
                <rect x="0" y="0" width="22" height="11" rx="2" />
                <path d="M 11 11 L 11 34" />
              </g>
            </g>
          </g>

          <!-- 星点 -->
          <g fill="#e8e8e8" stroke="none">
            <use class="star s1" href="#init-sparkle" transform="translate(64 84)" />
            <use class="star s2" href="#init-sparkle" transform="translate(266 116) scale(0.68)" />
            <circle cx="42" cy="240" r="1" opacity="0.35" />
            <circle cx="284" cy="268" r="1" opacity="0.3" />
            <circle cx="150" cy="56" r="1.1" opacity="0.35" />
          </g>

          <!-- 地面与小草 -->
          <g filter="url(#rough-init)">
            <path d="M 70 314 Q 160 304 250 314" opacity="0.4" />
            <path d="M 44 321 Q 160 309 276 321" opacity="0.22" />
            <path d="M 92 314 q -3 -8 -1 -12" opacity="0.4" />
            <path d="M 230 315 q 4 -8 2 -12" opacity="0.4" />
          </g>
        </g>
      </svg>
    </template>

    <p class="title">初始化</p>
    <p class="en">Initialize</p>
    <p class="counter">先定一个管理密码</p>

    <form class="addbar stack" @submit.prevent="submit">
      <input
        v-model="password"
        type="password"
        placeholder="管理密码（至少 6 位）"
        autocomplete="new-password"
      />
      <input v-model="confirm" type="password" placeholder="再写一次" autocomplete="new-password" />
      <button type="submit" :disabled="busy">{{ busy ? '处理中…' : '立碑' }}</button>
    </form>

    <p v-if="error" class="muterr">{{ error }}</p>

    <ul class="list">
      <li :style="{ '--i': 0 }">
        <span class="num">01</span>
        <span class="text">这个密码用来解锁「愿」与「言」的增、删、改。</span>
      </li>
      <li :style="{ '--i': 1 }">
        <span class="num">02</span>
        <span class="text">加盐后只存哈希，谁也读不回原文——包括你。</span>
      </li>
      <li :style="{ '--i': 2 }">
        <span class="num">03</span>
        <span class="text">忘了就只能清库重来。请郑重一点。</span>
      </li>
    </ul>
    <p class="endhint">立好这块碑，就可以开始写了。</p>
  </PageScene>
</template>

<style scoped>
/* 页面独有：说明列表 */
.list {
  margin: 4vh 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.list li {
  display: flex;
  align-items: baseline;
  gap: 14px;
}

.text {
  flex: 1;
  font-size: 14px;
  line-height: 1.9;
  letter-spacing: 0.12em;
  color: #c9c9c9;
}

@media (max-width: 820px) {
  .text {
    font-size: 13px;
  }
}
</style>
