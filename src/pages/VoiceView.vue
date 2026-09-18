<script setup>
import { ref } from 'vue'

// 留言：存在浏览器 localStorage。悼念最好趁生前。
const KEY = 'rip.voices.v1'

const voices = ref(load())
const draft = ref('')

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(voices.value))
  } catch {}
}
function add() {
  const text = draft.value.trim()
  if (!text) return
  voices.value.unshift({ id: Date.now(), text, ts: Date.now() })
  draft.value = ''
  save()
}
function remove(v) {
  voices.value = voices.value.filter((x) => x !== v)
  save()
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

    <!-- 左侧线稿：一只收集话语的信箱 -->
    <div class="ornament" aria-hidden="true">
      <svg class="art" viewBox="0 0 320 360">
      <g fill="none" stroke="#cfcfcf" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <defs>
          <path
            id="sparkle"
            d="M 0 -7 C 1 -2 2 -1 7 0 C 2 1 1 2 0 7 C -1 2 -2 1 -7 0 C -2 -1 -1 -2 0 -7 Z"
          />
        </defs>

        <!-- 飘来的信 -->
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

        <!-- 星点 -->
        <g fill="#e8e8e8" stroke="none">
          <use class="star s1" href="#sparkle" transform="translate(56 70)" />
          <use class="star s2" href="#sparkle" transform="translate(286 220) scale(0.7)" />
          <circle cx="36" cy="180" r="1" opacity="0.35" />
          <circle cx="284" cy="120" r="1" opacity="0.35" />
        </g>

        <!-- 信箱 -->
        <g class="mailbox">
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

        <!-- 地面与小草 -->
        <path d="M 70 312 Q 160 302 250 312" opacity="0.4" />
        <path d="M 44 319 Q 160 307 276 319" opacity="0.22" />
        <path d="M 90 312 q -3 -8 -1 -12" opacity="0.4" />
        <path d="M 232 313 q 4 -8 2 -12" opacity="0.4" />
      </g>
      </svg>
    </div>

    <header class="topbar">
      <p class="title">趁我还在，想说的话</p>
      <p class="en">Say It While I'm Here</p>
    </header>

    <section class="board">
      <form class="add" @submit.prevent="add">
        <input v-model="draft" placeholder="写一句想对「我」说的话" maxlength="60" />
        <button type="submit">留下</button>
      </form>
      <ul class="list">
        <li v-for="v in voices" :key="v.id">
          <p class="text">{{ v.text }}</p>
          <p class="meta">
            <span>{{ fmt(v.ts) }}</span>
            <button class="del" type="button" title="收回这句话" @click="remove(v)">✕</button>
          </p>
        </li>
        <li v-if="!voices.length" class="empty">还没有人来说过话。趁现在，说一句吧。</li>
      </ul>
    </section>

    <footer class="hint">悼念这件事，最好趁生前。</footer>
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

/* 左侧信箱 */
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

/* 飘动的信 */
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

.add {
  flex: none;
  display: flex;
  align-items: stretch;
  gap: 16px;
  margin-bottom: 3.2vh;
}

.add input {
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

.add input::placeholder {
  color: #7c7c7c;
}

.add input:focus {
  border-bottom-color: #b5b5b5;
}

.add button {
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

.add button:hover {
  color: #fff;
  border-color: #ddd;
}

/* 只有留言列表滚动，输入框固定 */
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
  opacity: 0;
  transition: opacity 0.3s, color 0.3s;
  padding: 2px 4px;
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

  .title {
    letter-spacing: 0.3em;
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
  .letter,
  .star {
    animation: none;
  }
}
</style>
