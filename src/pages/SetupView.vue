<script setup>
import PageScene from '../components/PageScene.vue'
defineEmits(['recheck'])
</script>

<template>
  <PageScene ghost="设">
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
              id="setup-sparkle"
              d="M 0 -7 C 1 -2 2 -1 7 0 C 2 1 1 2 0 7 C -1 2 -2 1 -7 0 C -2 -1 -1 -2 0 -7 Z"
            />
            <filter id="rough-setup" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.05"
                numOctaves="3"
                seed="13"
                result="n"
              />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
            </filter>
          </defs>

          <!-- 虚线地基：碑该立在这里，但还什么都没有 -->
          <g filter="url(#rough-setup)">
            <path
              d="M 96 226 L 224 226 L 224 292 L 96 292 Z"
              stroke-dasharray="7 8"
              opacity="0.45"
            />
            <path d="M 120 258 L 200 258" stroke-dasharray="4 7" opacity="0.2" />
          </g>

          <!-- 插在土里的铁锹 -->
          <g filter="url(#rough-setup)">
            <g transform="translate(246 148) rotate(11)">
              <path d="M 0 0 L 0 96" opacity="0.85" />
              <path d="M -13 0 L 13 0" opacity="0.85" />
              <path d="M -13 96 L 13 96 L 9 128 Q 0 138 -9 128 Z" opacity="0.9" />
            </g>
          </g>

          <!-- 飘着的石块：等着被砌上去 -->
          <g filter="url(#rough-setup)">
            <g transform="translate(62 160) rotate(-12)">
              <g class="drift">
                <rect x="0" y="0" width="26" height="15" rx="2" />
                <path d="M 0 7.5 L 26 7.5" opacity="0.3" />
              </g>
            </g>
            <g transform="translate(96 108) rotate(8) scale(0.75)" opacity="0.6">
              <g class="drift d2">
                <rect x="0" y="0" width="26" height="15" rx="2" />
              </g>
            </g>
          </g>

          <!-- 星点 -->
          <g fill="#e8e8e8" stroke="none">
            <use class="star s1" href="#setup-sparkle" transform="translate(58 82)" />
            <use class="star s2" href="#setup-sparkle" transform="translate(272 96) scale(0.68)" />
            <circle cx="40" cy="240" r="1" opacity="0.35" />
            <circle cx="288" cy="262" r="1" opacity="0.3" />
            <circle cx="164" cy="58" r="1.1" opacity="0.35" />
          </g>

          <!-- 地面与小草 -->
          <g filter="url(#rough-setup)">
            <path d="M 70 314 Q 160 304 250 314" opacity="0.4" />
            <path d="M 44 321 Q 160 309 276 321" opacity="0.22" />
            <path d="M 92 314 q -3 -8 -1 -12" opacity="0.4" />
            <path d="M 230 315 q 4 -8 2 -12" opacity="0.4" />
          </g>
        </g>
      </svg>
    </template>

    <p class="title">储存库尚未配置</p>
    <p class="en">Not Configured</p>
    <p class="counter">先给它一个存放记忆的地方</p>
    <ul class="list">
      <li :style="{ '--i': 0 }">
        <span class="num">01</span>
        <div class="step">
          <p class="steptitle">登录 Cloudflare 并创建数据库</p>
          <code>npx wrangler login</code>
          <code>npx wrangler d1 create rip-db</code>
          <p class="stepsub">把输出的 database_id 填进 wrangler.toml</p>
        </div>
      </li>
      <li :style="{ '--i': 1 }">
        <span class="num">02</span>
        <div class="step">
          <p class="steptitle">本地预览（会自动建表）</p>
          <code>npm run api</code>
          <p class="stepsub">另开一个终端跑 npm run dev，打开 localhost:5173</p>
        </div>
      </li>
      <li :style="{ '--i': 2 }">
        <span class="num">03</span>
        <div class="step">
          <p class="steptitle">线上部署（Cloudflare Pages）</p>
          <code>npm run build &amp;&amp; npx wrangler pages deploy dist</code>
          <p class="stepsub">或连 git 仓库自动部署；面板里给项目绑定 D1，变量名 DB</p>
        </div>
      </li>
    </ul>
    <form class="addbar" @submit.prevent="$emit('recheck')">
      <button type="submit">重新检测</button>
    </form>
    <p class="endhint">地基打好了，再回来立碑。</p>
  </PageScene>
</template>

<style scoped>
/* 页面独有：步骤列表与命令 */
.list {
  margin: 3.4vh 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.list li {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 2.2vh 2px;
}

.step {
  flex: 1;
  min-width: 0;
}

.steptitle {
  margin: 0;
  font-size: 14px;
  letter-spacing: 0.14em;
  line-height: 1.9;
  color: #e3e3e3;
}

/* 命令用一条竖线标出来，而不是灰底圆角——整站没有第二个圆角块 */
.step code {
  display: block;
  margin: 1vh 0 0;
  padding-left: 12px;
  border-left: 1px solid rgba(255, 255, 255, 0.22);
  font-family: Consolas, Menlo, monospace;
  font-size: 12px;
  line-height: 1.9;
  color: #b0b0b0;
  overflow-x: auto;
  white-space: pre;
  -webkit-user-select: text;
  user-select: text;
}

.stepsub {
  margin: 1.2vh 0 0;
  font-size: 11px;
  letter-spacing: 0.16em;
  line-height: 1.8;
  color: #7f7f7f;
}

/* 「重新检测」排在步骤之后 */
.addbar {
  margin: 3vh 0 0;
}

@media (max-width: 820px) {
  .steptitle {
    font-size: 13px;
  }
}
</style>
