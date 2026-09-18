# 墓 · RIP

给自己的极简黑白数字墓碑。Vue 3 + Vite，运行时零依赖。

## 运行

```bash
npm install
npm run dev     # 打开 http://localhost:5173
```

## 构建

```bash
npm run build   # 产物在 dist/
```

## 页面

底部「碑 · 愿 · 言」三个字是导航（对应 `#/bei`、`#/yuan`、`#/yan`）：

- **碑** —— 主页：石碑刻字、烛火点灭、献白花
- **愿** —— 遗愿清单：打勾 / 新增 / 划掉，数据存浏览器 localStorage（`rip.wishes.v1`）
- **言** —— 留言：「趁我还在，想说的话」，同样本地存储（`rip.voices.v1`）

## 改文字

- 碑页文案：[src/epitaph.js](src/epitaph.js)（顶端小字、名字、生卒、墓志铭、英文注、背景巨字）
- 遗愿清单的初始种子：[src/pages/WishView.vue](src/pages/WishView.vue) 顶部的 `SEEDS`
