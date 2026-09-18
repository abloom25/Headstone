<script setup>
import { computed, ref } from 'vue'

// 遗愿清单：第一次来访会种下这几颗种子，之后都存在浏览器 localStorage
const SEEDS = [
  '去看一次真正的极光',
  '学会一首能完整弹下来的曲子',
  '和爸妈拍一张不催不赶的合照',
  '原谅一件记了很多年的小事',
  '把熬夜戒成一个传说',
]
const KEY = 'rip.wishes.v1'

const wishes = ref(load())
const draft = ref('')

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return SEEDS.map((text, i) => ({ id: i + 1, text, done: false }))
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(wishes.value))
  } catch {}
}
function add() {
  const text = draft.value.trim()
  if (!text) return
  wishes.value.push({ id: Date.now(), text, done: false })
  draft.value = ''
  save()
}
function toggle(w) {
  w.done = !w.done
  save()
}
function remove(w) {
  wishes.value = wishes.value.filter((x) => x !== w)
  save()
}
const doneCount = computed(() => wishes.value.filter((w) => w.done).length)
</script>

<template>
  <section class="scene">
    <span class="ghost" aria-hidden="true">愿</span>

    <!-- 左侧线稿：星夜、流星与远山 -->
    <div class="ornament" aria-hidden="true">
      <div class="moon"></div>
      <svg class="art" viewBox="0 0 320 360">
      <g fill="none" stroke="#cfcfcf" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <defs>
          <path
            id="sparkle"
            d="M 0 -7 C 1 -2 2 -1 7 0 C 2 1 1 2 0 7 C -1 2 -2 1 -7 0 C -2 -1 -1 -2 0 -7 Z"
          />
          <linearGradient id="hill-fade" gradientUnits="userSpaceOnUse" x1="0" y1="278" x2="0" y2="360">
            <stop offset="0" stop-color="#ffffff" stop-opacity="1" />
            <stop offset="0.72" stop-color="#ffffff" stop-opacity="0.5" />
            <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="shoot-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-70" y2="-34">
            <stop offset="0" stop-color="#ffffff" stop-opacity="0.9" />
            <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
        </defs>

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

        <!-- 三层远山 -->
        <path
          d="M 0 312 C 50 292 96 286 140 300 C 180 312 220 288 258 296 C 284 302 306 298 320 304 L 320 360 L 0 360 Z"
          fill="url(#hill-fade)"
          fill-opacity="0.05"
          stroke="none"
        />
        <path
          d="M 0 330 C 44 314 88 310 132 322 C 176 334 214 316 254 322 C 282 326 304 322 320 326 L 320 360 L 0 360 Z"
          fill="url(#hill-fade)"
          fill-opacity="0.08"
          stroke="none"
        />
        <path
          d="M 0 348 C 60 336 120 334 176 342 C 232 350 282 342 320 346 L 320 360 L 0 360 Z"
          fill="url(#hill-fade)"
          fill-opacity="0.12"
          stroke="none"
        />
      </g>
      </svg>
    </div>

    <header class="topbar">
      <p class="title">死前想做完的事</p>
      <p class="en">Bucket List</p>
    </header>

    <section class="board">
      <p class="counter">{{ doneCount }} / {{ wishes.length }} 已完成</p>
      <ul class="list">
        <li v-for="(w, i) in wishes" :key="w.id" :class="{ done: w.done }">
          <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
          <button
            class="tick"
            type="button"
            :aria-pressed="w.done"
            :title="w.done ? '标记为未完成' : '标记为已完成'"
            @click="toggle(w)"
          ></button>
          <span class="text">{{ w.text }}</span>
          <button class="del" type="button" title="划掉这一条" @click="remove(w)">✕</button>
        </li>
        <li v-if="!wishes.length" class="empty">还没有写下任何事。</li>
      </ul>
      <form class="add" @submit.prevent="add">
        <input v-model="draft" placeholder="写下一件事，回车记下" maxlength="40" />
      </form>
    </section>

    <footer class="hint">打过勾的，就当作已经无悔。</footer>
  </section>
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0;
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;
}

.ghost {
  position: absolute;
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

/* 左侧夜景 */
.ornament {
  position: absolute;
  z-index: 2;
  left: 6vw;
  top: 50%;
  transform: translateY(-50%);
  width: clamp(240px, 28vw, 390px);
  pointer-events: none;
  opacity: 0.9;
  /* 边缘渐隐，让画面融进黑背景 */
  -webkit-mask-image: radial-gradient(100% 100% at 50% 42%, #000 45%, transparent 82%);
  mask-image: radial-gradient(100% 100% at 50% 42%, #000 45%, transparent 82%);
}

.art {
  display: block;
  width: 100%;
  height: auto;
}

/* CSS 光晕月亮：亮核 + 分层辉光 */
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

.topbar {
  position: absolute;
  z-index: 3;
  top: 5vh;
  left: 7vw;
  right: 7vw;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  pointer-events: none;
}

.title {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.5em;
  color: #a5a5a5;
}

.en {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #8a8a8a;
}

.board {
  position: absolute;
  z-index: 3;
  right: 9vw;
  top: 50%;
  transform: translateY(-50%);
  width: min(560px, 44vw);
  max-height: 72vh;
  display: flex;
  flex-direction: column;
  /* 深色底板：把文字从背景巨字上托出来 */
  background: rgba(2, 2, 2, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  padding: 2.4vh 20px;
}

.counter {
  flex: none;
  margin: 0 0 2.4vh;
  font-size: 11px;
  letter-spacing: 0.4em;
  color: #9c9c9c;
}

/* 只有清单本身滚动，计数器与输入框固定 */
.list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin: 0;
  padding: 0 8px 0 0;
  list-style: none;
  scrollbar-width: thin;
  scrollbar-color: #2e2e2e transparent;
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
  transition: border-color 0.3s, background 0.3s;
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
  transition: opacity 0.3s, color 0.3s;
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

.add {
  flex: none;
}

.add input {
  width: 100%;
  margin-top: 2.2vh;
  padding: 10px 2px;
  background: none;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  color: #eaeaea;
  font: inherit;
  font-size: 14px;
  letter-spacing: 0.12em;
  outline: none;
  transition: border-color 0.3s;
}

.add input::placeholder {
  color: #7c7c7c;
}

.add input:focus {
  border-bottom-color: #b5b5b5;
}

.hint {
  position: absolute;
  z-index: 3;
  left: 7vw;
  bottom: 6vh;
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: #8f8f8f;
  pointer-events: none;
}

@media (max-width: 820px) {
  .board {
    left: 50%;
    right: auto;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 84vw;
    max-height: 62vh;
  }

  .ghost {
    font-size: 58vw;
    top: 2vh;
    transform: translate(8%, 0);
  }

  .ornament {
    display: none;
  }

  .topbar {
    top: 3.5vh;
    left: 6vw;
    right: 6vw;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
  }

  .en {
    font-size: 9px;
  }

  .text {
    font-size: 14px;
  }

  .hint {
    left: 6vw;
    right: 6vw;
    bottom: 6.5vh;
    text-align: center;
    font-size: 10px;
    letter-spacing: 0.22em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .star,
  .shoot {
    animation: none;
  }
}
</style>
