<script setup>
import { onMounted, ref } from 'vue'
import { useAdmin } from '../admin'

const { isAdmin, authHeaders } = useAdmin()

const voices = ref([])
const state = ref('loading') // loading | ready | error
const draft = ref('')
const postError = ref('')

async function load() {
  state.value = 'loading'
  try {
    const res = await fetch('/api/voices')
    if (!res.ok) throw new Error()
    voices.value = (await res.json()).voices
    state.value = 'ready'
    // 后端已接管，清掉早期存在浏览器里的旧留言
    localStorage.removeItem('rip.voices.v1')
  } catch {
    state.value = 'error'
  }
}
onMounted(load)

async function add() {
  const text = draft.value.trim()
  if (!text) return
  postError.value = ''
  try {
    const res = await fetch('/api/voices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (res.status === 429) {
      postError.value = '说得太快啦，歇一会儿。'
      return
    }
    if (!res.ok) throw new Error()
    voices.value.unshift(await res.json())
    draft.value = ''
  } catch {
    postError.value = '没寄出去，再试一次。'
  }
}

async function remove(v) {
  const res = await fetch(`/api/voices/${v.id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (res.ok) {
    voices.value = voices.value.filter((x) => x !== v)
  }
}

function fmt(ts) {
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
}
</script>

<template>
  <section class="scene">
    <span class="ghost" aria-hidden="true">言</span>

    <!-- 左侧：信箱与飘信（固定背景） -->
    <div class="ornament" aria-hidden="true">
      <svg class="art" viewBox="30 55 270 275">
      <g fill="none" stroke="#cfcfcf" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <defs>
          <path
            id="sparkle"
            d="M 0 -7 C 1 -2 2 -1 7 0 C 2 1 1 2 0 7 C -1 2 -2 1 -7 0 C -2 -1 -1 -2 0 -7 Z"
          />
          <filter id="rough-mail" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" />
          </filter>
        </defs>

        <!-- 飘来的信：手绘抖边 -->
        <g filter="url(#rough-mail)">
          <g transform="translate(64 132) rotate(-10)">
            <g class="letter">
              <rect x="0" y="0" width="26" height="17" rx="1.5" />
              <path d="M 1 1.5 L 13 10 L 25 1.5" />
            </g>
          </g>
          <g transform="translate(238 150) rotate(9)" opacity="0.85">
            <g class="letter l2">
              <rect x="0" y="0" width="22" height="15" rx="1.5" />
              <path d="M 1 1.5 L 11 8.5 L 21 1.5" />
            </g>
          </g>
          <g transform="translate(250 78) rotate(-5) scale(0.7)" opacity="0.6">
            <g class="letter l3">
              <rect x="0" y="0" width="22" height="15" rx="1.5" />
              <path d="M 1 1.5 L 11 8.5 L 21 1.5" />
            </g>
          </g>
        </g>

        <!-- 星点 -->
        <g fill="#e8e8e8" stroke="none">
          <use class="star s1" href="#sparkle" transform="translate(56 70)" />
          <use class="star s2" href="#sparkle" transform="translate(286 220) scale(0.7)" />
          <circle cx="36" cy="180" r="1" opacity="0.35" />
          <circle cx="284" cy="120" r="1" opacity="0.35" />
        </g>

        <!-- 信箱：手绘凿刻感 -->
        <g class="mailbox" filter="url(#rough-mail)">
          <path
            d="M 108 150 A 52 46 0 0 1 212 150 L 212 286 Q 212 294 204 294 L 116 294 Q 108 294 108 286 Z"
            opacity="0.9"
          />
          <path d="M 108 168 L 212 168" opacity="0.3" />
          <rect x="124" y="188" width="72" height="11" rx="4" opacity="0.85" />
          <circle cx="160" cy="220" r="2.6" opacity="0.7" />
          <path d="M 160 223 L 160 230" opacity="0.5" />
          <path d="M 96 294 L 224 294 L 224 304 L 96 304 Z" opacity="0.7" />
        </g>

        <!-- 地面与小草：同一份手绘感 -->
        <g filter="url(#rough-mail)">
          <path d="M 70 312 Q 160 302 250 312" opacity="0.4" />
          <path d="M 44 319 Q 160 307 276 319" opacity="0.22" />
          <path d="M 90 312 q -3 -8 -1 -12" opacity="0.4" />
          <path d="M 232 313 q 4 -8 2 -12" opacity="0.4" />
        </g>
      </g>
      </svg>
    </div>

    <!-- 上下遮罩：透明到模糊压暗，保证文字可读 -->
    <div class="veil top" aria-hidden="true"></div>
    <div class="veil bottom" aria-hidden="true"></div>

    <!-- 左下：标题与写信 -->
    <header class="titleblock">
      <p class="title">趁我还在，想说的话</p>
      <p class="en">Say It While I'm Here</p>
      <p class="counter">留言 · {{ voices.length }}</p>
      <form class="addbar" @submit.prevent="add">
        <input v-model="draft" placeholder="写一句想对「我」说的话" maxlength="60" />
        <button type="submit">留下</button>
      </form>
      <p v-if="postError" class="muterr">{{ postError }}</p>
    </header>

    <!-- 右侧：从上到下的大留言竖栏 -->
    <div class="listwrap">
      <template v-if="state === 'ready'">
        <ul class="list">
          <li v-for="v in voices" :key="v.id">
            <p class="text">{{ v.text }}</p>
            <p class="meta">
              <span>{{ fmt(v.ts) }}</span>
              <button
                v-if="isAdmin"
                class="del"
                type="button"
                title="删除留言"
                @click="remove(v)"
              >✕</button>
            </p>
          </li>
          <li v-if="!voices.length" class="empty">还没有人来说过话。趁现在，说一句吧。</li>
        </ul>

        <p class="endhint">悼念这件事，最好趁生前。</p>
      </template>
      <p v-else-if="state === 'loading'" class="state">正在开启信箱…</p>
      <div v-else class="state">
        信箱暂时打不开，过会儿再来看看。
        <button class="retry" type="button" @click="load">重试</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-user-select: none;
  user-select: none;
  scrollbar-width: none;
}

.scene::-webkit-scrollbar {
  display: none;
}

.ghost {
  position: fixed;
  z-index: 1;
  right: 0;
  top: 50%;
  transform: translate(6%, -54%);
  font-size: 76vh;
  line-height: 1;
  font-weight: 600;
  color: transparent;
  -webkit-text-stroke: 1.8px rgba(255, 255, 255, 0.09);
  pointer-events: none;
}

@supports not (-webkit-text-stroke: 1px #fff) {
  .ghost {
    color: rgba(255, 255, 255, 0.035);
  }
}

/* 左侧信箱：固定背景 */
.ornament {
  position: fixed;
  z-index: 2;
  left: 4vw;
  top: 50%;
  transform: translateY(-50%);
  width: clamp(300px, 44vw, 640px);
  pointer-events: none;
  opacity: 0.9;
  -webkit-mask-image: radial-gradient(100% 100% at 50% 42%, #000 45%, transparent 82%);
  mask-image: radial-gradient(100% 100% at 50% 42%, #000 45%, transparent 82%);
}

.art {
  display: block;
  width: 100%;
  height: auto;
}

.letter {
  animation: float-y 6s ease-in-out infinite;
}

.letter.l2 {
  animation-delay: -2.4s;
}

.letter.l3 {
  animation-delay: -4.2s;
}

@keyframes float-y {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

.star {
  animation: twinkle 3.6s ease-in-out infinite alternate;
}

.star.s2 {
  animation-delay: 1.4s;
}

@keyframes twinkle {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}

/* 上下遮罩：透明到模糊压暗 */
.veil {
  position: fixed;
  left: 0;
  right: 0;
  height: 24vh;
  z-index: 4;
  pointer-events: none;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.veil.top {
  top: 0;
  background: linear-gradient(180deg, rgba(2, 2, 2, 0.55) 0%, rgba(2, 2, 2, 0) 100%);
  -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, transparent 100%);
}

.veil.bottom {
  bottom: 0;
  height: 34vh;
  background: linear-gradient(
    0deg,
    rgba(2, 2, 2, 0.78) 0%,
    rgba(2, 2, 2, 0.45) 55%,
    rgba(2, 2, 2, 0) 100%
  );
  -webkit-mask-image: linear-gradient(0deg, #000 0%, transparent 100%);
  mask-image: linear-gradient(0deg, #000 0%, transparent 100%);
}

/* 左下标题与写信：固定，不随内容滚动 */
.titleblock {
  position: fixed;
  z-index: 5;
  left: 7vw;
  bottom: 9vh;
}

.title {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.55em;
  color: #c5c5c5;
  text-shadow:
    0 0 12px rgba(0, 0, 0, 0.9),
    0 0 4px rgba(0, 0, 0, 0.8);
}

.en {
  margin: 1.4vh 0 0;
  font-size: 10px;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #8a8a8a;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
}

.counter {
  margin: 2.6vh 0 0;
  font-size: 11px;
  letter-spacing: 0.4em;
  color: #9c9c9c;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
}

.addbar {
  display: flex;
  align-items: stretch;
  gap: 14px;
  margin: 2vh 0 0;
  width: min(430px, 36vw);
}

.addbar input {
  flex: 1;
  padding: 10px 2px;
  background: none;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  color: #eaeaea;
  font: inherit;
  font-size: 14px;
  letter-spacing: 0.1em;
  outline: none;
  transition: border-color 0.3s;
}

.addbar input::placeholder {
  color: #7c7c7c;
}

.addbar input:focus {
  border-bottom-color: #b5b5b5;
}

.addbar button {
  flex: none;
  padding: 10px 22px;
  border: 1px solid #6f6f6f;
  background: none;
  color: #c9c9c9;
  font: inherit;
  font-size: 12px;
  letter-spacing: 0.4em;
  text-indent: 0.4em;
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s;
}

.addbar button:hover {
  color: #fff;
  border-color: #ddd;
}

.muterr {
  margin: 1.2vh 0 0;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #b0b0b0;
}

/* 右侧大留言竖栏：随页面自然滚动，尾部留白让末项能滚到屏幕中部 */
.listwrap {
  position: relative;
  z-index: 3;
  width: min(430px, 34vw);
  margin: 45vh 9vw 45vh auto;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  padding: 2.2vh 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

li.empty {
  display: flex;
  justify-content: center;
  border-bottom: none;
  font-size: 13px;
  letter-spacing: 0.3em;
  color: #8a8a8a;
}

.text {
  margin: 0;
  font-size: 15px;
  letter-spacing: 0.14em;
  line-height: 1.9;
  color: #e3e3e3;
}

.meta {
  margin: 0.8vh 0 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: #909090;
}

.del {
  border: 0;
  background: none;
  color: #909090;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 4px;
  transition: color 0.3s;
}

.del:hover {
  color: #fff;
}

.state {
  margin: 4vh 0;
  font-size: 13px;
  letter-spacing: 0.3em;
  color: #8a8a8a;
  text-align: center;
}

.retry {
  margin-left: 10px;
  background: none;
  border: 0;
  color: #d0d0d0;
  font: inherit;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}

.endhint {
  margin: 3vh 0 0;
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: #8f8f8f;
}

@media (max-width: 820px) {
  .ornament {
    display: block;
    position: relative;
    left: 0;
    top: 0;
    transform: none;
    width: 70vw;
    margin: 12vh auto 0;
    opacity: 0.9;
  }

  .titleblock {
    position: static;
    width: auto;
    padding: 0 8vw;
    margin-top: 1vh;
    text-align: center;
  }

  .listwrap {
    width: auto;
    margin: 2vh 8vw 12vh;
  }

  .veil.top {
    display: none;
  }

  .veil.bottom {
    height: 14vh;
  }

  .addbar {
    flex-direction: column;
    gap: 12px;
    width: auto;
    margin: 2.4vh 0 0;
  }

  .addbar input {
    width: 100%;
    padding: 12px 14px;
    font-size: 16px;
    text-align: center;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
  }

  .addbar button {
    width: 100%;
    padding: 12px;
  }

  .ghost {
    font-size: 58vw;
    top: 2vh;
    transform: translate(8%, 0);
  }

  .text {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .letter,
  .star {
    animation: none;
  }
}
</style>
