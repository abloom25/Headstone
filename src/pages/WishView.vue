<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdmin } from '../admin'
import AddBar from '../components/AddBar.vue'
import { timeoutSignal } from '../http'

const { isAdmin, authHeaders } = useAdmin()

const wishes = ref([])
const state = ref('loading') // loading | ready | error
const draft = ref('')
const mutError = ref('')

async function load() {
  state.value = 'loading'
  try {
    const res = await fetch('/api/wishes', { signal: timeoutSignal(10000) })
    if (!res.ok) throw new Error()
    wishes.value = (await res.json()).wishes
    state.value = 'ready'
  } catch {
    state.value = 'error'
  }
}
onMounted(load)

const doneCount = computed(() => wishes.value.filter((w) => w.done).length)

async function add() {
  const text = draft.value.trim()
  if (!text) return
  mutError.value = ''
  try {
    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: timeoutSignal(10000),
    })
    if (res.status === 403) {
      mutError.value = '管理会话已过期，请重新登录。'
      return
    }
    if (!res.ok) throw new Error()
    wishes.value.push(await res.json())
    draft.value = ''
  } catch {
    mutError.value = '没记下来，再试一次。'
  }
}

async function toggle(w) {
  mutError.value = ''
  try {
    const res = await fetch(`/api/wishes/${w.id}`, {
      method: 'PATCH',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !w.done }),
      signal: timeoutSignal(10000),
    })
    if (res.status === 403) {
      mutError.value = '管理会话已过期，请重新登录。'
      return
    }
    if (!res.ok) throw new Error()
    w.done = !w.done
  } catch {
    mutError.value = '没改成，再试一次。'
  }
}

async function remove(w) {
  mutError.value = ''
  try {
    const res = await fetch(`/api/wishes/${w.id}`, {
      method: 'DELETE',
      headers: authHeaders(),
      signal: timeoutSignal(10000),
    })
    if (res.status === 403) {
      mutError.value = '管理会话已过期，请重新登录。'
      return
    }
    if (!res.ok) throw new Error()
    wishes.value = wishes.value.filter((x) => x !== w)
  } catch {
    mutError.value = '没删掉，再试一次。'
  }
}
</script>

<template>
  <section class="scene">
    <span class="ghost" aria-hidden="true">愿</span>

    <!-- 左侧：星夜、流星与远山（固定背景） -->
    <div class="ornament" aria-hidden="true">
      <svg class="art" viewBox="0 0 320 360">
        <g
          fill="none"
          stroke="#cfcfcf"
          stroke-width="1.3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <defs>
            <path
              id="sparkle"
              d="M 0 -7 C 1 -2 2 -1 7 0 C 2 1 1 2 0 7 C -1 2 -2 1 -7 0 C -2 -1 -1 -2 0 -7 Z"
            />
            <linearGradient
              id="shoot-fade"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="-70"
              y2="-34"
            >
              <stop offset="0" stop-color="#ffffff" stop-opacity="0.9" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <filter id="rough-hills" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035"
                numOctaves="3"
                seed="5"
                result="n"
              />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
            </filter>
            <filter id="rough-moon" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.06"
                numOctaves="3"
                seed="9"
                result="n"
              />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" />
            </filter>
          </defs>

          <!-- 手绘满月 -->
          <g filter="url(#rough-moon)">
            <circle cx="246" cy="78" r="46" fill="#ffffff" opacity="0.05" stroke="none" />
            <circle
              cx="248"
              cy="78"
              r="30"
              fill="rgba(238, 238, 238, 0.1)"
              stroke="#e8e8e8"
              stroke-width="1.5"
            />
            <circle cx="238" cy="68" r="5" opacity="0.25" />
            <circle cx="257" cy="86" r="3.5" opacity="0.2" />
            <circle cx="252" cy="64" r="2.5" opacity="0.18" />
          </g>

          <g class="stars" fill="#e8e8e8" stroke="none">
            <use class="star s1" href="#sparkle" transform="translate(48 140)" />
            <use class="star s2" href="#sparkle" transform="translate(36 224) scale(0.7)" />
            <use class="star s3" href="#sparkle" transform="translate(150 60) scale(0.55)" />
            <use class="star s4" href="#sparkle" transform="translate(302 214) scale(0.6)" />
            <use class="star s5" href="#sparkle" transform="translate(210 150) scale(0.5)" />
            <use class="star s6" href="#sparkle" transform="translate(90 44) scale(0.5)" />
            <circle cx="30" cy="142" r="1" opacity="0.4" />
            <circle cx="110" cy="80" r="1.1" opacity="0.35" />
            <circle cx="200" cy="38" r="1" opacity="0.4" />
            <circle cx="282" cy="244" r="1" opacity="0.3" />
            <circle cx="66" cy="182" r="1" opacity="0.3" />
          </g>

          <!-- 流星：划一下，歇一会儿 -->
          <g transform="translate(120 80)">
            <g class="shoot">
              <line x1="0" y1="0" x2="-70" y2="-34" stroke="url(#shoot-fade)" />
              <circle r="1.8" fill="#ffffff" stroke="none" />
            </g>
          </g>

          <!-- 三层远山：手绘棱线 -->
          <g filter="url(#rough-hills)">
            <path
              d="M -20 300 C 40 278 96 272 140 286 C 180 298 224 276 262 284 C 288 290 308 286 330 292"
              stroke-opacity="0.5"
            />
            <path
              d="M -20 322 C 44 306 88 302 132 314 C 176 326 218 308 258 314 C 286 318 308 314 330 318"
              stroke-opacity="0.35"
            />
            <path
              d="M -20 344 C 60 332 120 330 176 338 C 232 346 282 338 330 342"
              stroke-opacity="0.25"
            />
          </g>
        </g>
      </svg>
    </div>

    <!-- 上下遮罩：透明到模糊压暗，保证文字可读 -->
    <div class="veil top" aria-hidden="true"></div>
    <div class="veil bottom" aria-hidden="true"></div>

    <!-- 左下：标题与计数（管理时此处还有添加栏） -->
    <header class="titleblock">
      <p class="title">死前想做完的事</p>
      <p class="en">Bucket List</p>
      <p class="counter">{{ doneCount }} / {{ wishes.length }} 已完成</p>
      <AddBar
        v-if="isAdmin"
        v-model="draft"
        placeholder="写下一件事"
        :maxlength="40"
        submit-label="记下"
        button-on="mobile"
        width="min(300px, 100%)"
        @submit="add"
      />
      <p v-if="mutError" class="muterr">{{ mutError }}</p>
    </header>

    <!-- 右侧：从上到下的大列表竖栏 -->
    <div class="listwrap">
      <template v-if="state === 'ready'">
        <ul class="list">
          <li
            v-for="(w, i) in wishes"
            :key="w.id"
            :class="{ done: w.done }"
            :style="{ '--i': Math.min(i, 12) }"
          >
            <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span v-if="!isAdmin" class="tick readonly"></span>
            <button
              v-else
              class="tick"
              type="button"
              :aria-pressed="w.done"
              :title="w.done ? '标记为未完成' : '标记为已完成'"
              @click="toggle(w)"
            ></button>
            <span class="text">{{ w.text }}</span>
            <button v-if="isAdmin" class="del" type="button" title="划掉这一条" @click="remove(w)">
              ✕
            </button>
          </li>
          <li v-if="!wishes.length" class="empty">还没有写下任何事。</li>
        </ul>
        <p class="endhint">打过勾的，就当作已经无悔。</p>
      </template>
      <p v-else-if="state === 'loading'" class="state">正在展开清单…</p>
      <p v-else class="state">
        清单暂时读不出来。
        <button class="retry" type="button" @click="load">重试</button>
      </p>
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
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.045);
  pointer-events: none;
}

@supports not (-webkit-text-stroke: 1px #fff) {
  .ghost {
    color: rgba(255, 255, 255, 0.035);
  }
}

/* 左侧夜景：固定背景 */
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

.moon {
  position: absolute;
  left: 70%;
  top: 14%;
  width: 17%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 35%, #fafafa 0%, #e9e9e9 48%, #c9c9c9 100%);
  box-shadow:
    0 0 16px 2px rgba(255, 255, 255, 0.32),
    0 0 56px 10px rgba(255, 255, 255, 0.12),
    0 0 130px 34px rgba(255, 255, 255, 0.05);
}

.shoot {
  animation: shoot 9s ease-in 2.5s infinite;
  opacity: 0;
}

.star {
  animation: twinkle 3.6s ease-in-out infinite alternate;
}

.star.s2 {
  animation-delay: 0.9s;
}

.star.s3 {
  animation-delay: 1.7s;
}

.star.s4 {
  animation-delay: 2.6s;
}

.star.s5 {
  animation-delay: 1.2s;
}

.star.s6 {
  animation-delay: 2.1s;
}

@keyframes shoot {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  4% {
    opacity: 1;
  }
  11% {
    transform: translate(150px, 76px);
    opacity: 0;
  }
  100% {
    transform: translate(150px, 76px);
    opacity: 0;
  }
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

/* 左下标题与计数：固定，不随内容滚动 */
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

.muterr {
  margin: 1.2vh 0 0;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #b0b0b0;
}

/* 右侧大列表竖栏：随页面自然滚动，尾部留白让末项能滚到屏幕中部 */
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
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 1.7vh 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.num {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #8a8a8a;
}

.tick {
  flex: none;
  width: 16px;
  height: 16px;
  border: 1px solid #a3a3a3;
  border-radius: 50%;
  background: none;
  cursor: pointer;
  position: relative;
  transition:
    border-color 0.3s,
    background 0.3s;
}

.tick.readonly {
  cursor: default;
}

.tick:hover {
  border-color: #ffffff;
}

.tick::after {
  content: '✕';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #000;
  opacity: 0;
}

li.done .tick {
  background: #e8e8e8;
  border-color: #e8e8e8;
}

li.done .tick::after {
  opacity: 1;
}

.text {
  flex: 1;
  font-size: 15px;
  letter-spacing: 0.12em;
  color: #e3e3e3;
  transition: color 0.3s;
}

li.done .text {
  color: #6d6d6d;
  text-decoration: line-through;
  text-decoration-color: rgba(255, 255, 255, 0.3);
}

.del {
  flex: none;
  border: 0;
  background: none;
  color: #8a8a8a;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.3s,
    color 0.3s;
  padding: 4px;
}

li:hover .del {
  opacity: 1;
}

.del:hover {
  color: #fff;
}

@media (hover: none) {
  .del {
    opacity: 1;
  }
}

.empty {
  justify-content: center;
  font-size: 13px;
  letter-spacing: 0.3em;
  color: #8a8a8a;
  border-bottom: none;
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
  .star,
  .shoot {
    animation: none;
  }
}
</style>
