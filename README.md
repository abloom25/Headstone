<div align="center">

<img src="public/icon.svg" alt="RIP" width="100" height="100" />

# 墓 · RIP

**一座给自己的墓碑 —— 趁还活着的时候**

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages%20%2B%20D1-f38020?style=flat-square&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/pages/)
[![Conventional Commits](https://img.shields.io/badge/Commits-Conventional-fe5196?style=flat-square&logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org/)

[三页](#-三页) · [快速开始](#-快速开始) · [管理](#-管理) · [部署](#-部署) · [改文字](#-改文字) · [开发](#-开发)

</div>

---

墓志铭通常写给别人看，而且写得太晚。这个项目把顺序倒过来：先立碑，再活着；
清单上的事一件件划掉，想说的话趁人还在就说。

极简黑白，全站没有一张位图 —— 石碑、信箱、星夜、锁与钥匙都是手绘风格的 SVG，
边缘用 `feTurbulence` 做出凿刻般的不规则感。

## 🪦 三页

底部「碑 · 愿 · 言」三个字是导航，history 路由，对应 `/bei`、`/yuan`、`/yan`
（早期的 `#/bei` 链接会自动跳转）。

### 碑 —— 主页

- 🪨 **石碑刻字**：名字、生卒、墓志铭直接刻在碑面上
- 🕯️ **烛火**：点一下点亮或熄灭，熄灭时飘几缕青烟
- 🌼 **献花**：点击页面任意处种下一朵白花，最多留 24 朵
- ✨ **尘埃**：缓慢飘落的微粒，数量随屏幕收放

### 愿 —— 遗愿清单

- 访客只读，管理员可增、可勾、可删
- 打过勾的那条会被划掉，顶上记着「几件 / 共几件」

### 言 —— 留言

- 任何人都能写，可以署名，也可以留空当匿名
- 防刷：同 IP 60 秒一条、24 小时 5 条；带链接的直接拒收；
  蜜罐字段被填就假装收下但不入库
- 管理员可删

## 🚀 快速开始

```bash
pnpm install
pnpm dev     # 纯前端，5173
pnpm api     # 编译并启动带后端与 D1 的服务，8788
```

推荐两个终端分别跑 `api` 和 `dev`，然后打开 <http://localhost:5173> ——
Vite 会把 `/api` 代理到 8788，前后端都是真的。

只跑 `pnpm dev` 不跑 `api` 的话，页面会停在「储存库尚未配置」的引导页，
上面写着接下来该做什么。

## 🔐 管理

**管理密码在第一次打开站点时设置。** 数据库还没初始化时，页面会自动显示「初始化」表单；
密码加盐 SHA-256 后存进 D1 的 `settings` 表，**无法找回**。

登录页是 `/login`，故意没有界面入口，需要直接访问地址。令牌存在 localStorage，
在同一页可以登出。登录后「愿」「言」两页才会出现增删改的控件。

想从零走一遍初始化流程：停掉 `pnpm api`，删掉 `.wrangler/state/v3/d1`，重启。

## 🌍 部署

Cloudflare Pages + D1，全程免费额度够用。

```bash
pnpm exec wrangler login
pnpm exec wrangler d1 create rip-db          # 把输出的 database_id 填进 wrangler.toml
pnpm exec wrangler d1 migrations apply rip-db --remote
```

然后在 Cloudflare 面板：

1. **Workers & Pages → 创建 Pages 项目 → 连接本仓库**
   构建命令 `pnpm build`，输出目录 `dist`
2. **项目设置 → Functions → D1 数据库绑定**：变量名填 `DB`，选择 `rip-db`
3. 打开站点，设置管理密码

之后每次 push 自动上线。

把本地攒的数据搬到线上：

```bash
pnpm exec wrangler d1 export rip-db --local --output data.sql
pnpm exec wrangler d1 execute rip-db --remote --file data.sql
```

## ✍️ 改文字

碑面上的字全在 [src/epitaph.js](src/epitaph.js)，改完就是你的：

```js
export default {
  title: '献给依然活着的我', // 左上角小字
  en: 'A TOMB FOR THE LIVING', // 右上角英文小注
  ghost: '生', // 背景里的描边巨字
  name: '我', // 碑上的名字，一到两个字最好看
  born: '某个平常的日子',
  died: '尚未到来的某天',
  quote: '未知生，焉知死。', // 墓志铭，一行，别太长
}
```

愿望和留言存在 D1 里，通过页面维护。

## 🛠️ 开发

### 项目结构

```
├── functions/api/          Cloudflare Pages Functions
│   ├── _lib/admin.js       共用的管理校验（下划线开头，不会成为路由）
│   ├── status.js           探测：是否绑了 D1、是否已初始化
│   ├── init.js             首次初始化：建表 + 设管理密码
│   ├── wishes.js  wishes/[id].js
│   ├── voices.js  voices/[id].js
│   └── admin/verify.js
├── migrations/             D1 表结构，只增不改
├── public/icon.svg
└── src/
    ├── components/
    │   ├── PageScene.vue   页面外壳：巨字 + 插画 + 遮罩 + 右栏
    │   ├── AddBar.vue      写入栏，愿与言共用
    │   ├── Tombstone.vue   石碑 SVG
    │   ├── FlowerSpot.vue  白花
    │   └── Dust.vue        飘落的尘埃
    ├── pages/              TombView / WishView / VoiceView / LoginView / InitView / SetupView
    ├── styles/
    │   ├── base.css        全局底色与字体
    │   ├── page.css        PageScene 的版式（圈在 .page 下）
    │   └── form.css        表单，全站五个表单共用
    ├── admin.js            管理会话
    ├── epitaph.js          碑面文案
    ├── http.js             fetch 超时的兼容封装
    ├── router.js
    └── main.js
```

### 接口

| 方法     | 路径                | 鉴权 | 说明                         |
| -------- | ------------------- | ---- | ---------------------------- |
| `GET`    | `/api/status`       | —    | 是否绑了 D1、是否已初始化    |
| `POST`   | `/api/init`         | —    | 首次初始化，已初始化返回 409 |
| `POST`   | `/api/admin/verify` | 令牌 | 校验管理密码                 |
| `GET`    | `/api/wishes`       | —    | 愿望列表                     |
| `POST`   | `/api/wishes`       | 令牌 | 新增愿望                     |
| `PATCH`  | `/api/wishes/:id`   | 令牌 | 勾选 / 取消                  |
| `DELETE` | `/api/wishes/:id`   | 令牌 | 删除愿望                     |
| `GET`    | `/api/voices`       | —    | 留言列表（上限 200）+ 总数   |
| `POST`   | `/api/voices`       | —    | 留言，带限流与蜜罐           |
| `DELETE` | `/api/voices/:id`   | 令牌 | 删除留言                     |

鉴权用请求头 `X-Admin-Token`，值就是初始化时设的管理密码。

```bash
curl https://你的域名/api/status
curl -X POST https://你的域名/api/admin/verify -H "X-Admin-Token: $TOKEN"
curl -X DELETE https://你的域名/api/voices/3 -H "X-Admin-Token: $TOKEN"
```

### 样式的两条硬约束

改 `src/styles/` 之前请读一遍 [page.css](src/styles/page.css) 的文件头，两条都是踩出来的：

1. **全局选择器必须圈在命名空间下。** `.panel`、`.title`、`.en`、`.scene` 这些名字全站都在用，
   裸类名会泄漏 —— 碑页的 `.panel` 是横向 flex，曾被漏进去的 `flex-direction: column`
   压成上下堆叠。
2. **用到共享 `@keyframes` 的 `animation` 声明必须也留在全局文件里。** Vue 的 scoped 样式会给
   关键帧加组件哈希，写回 scoped 里会被重命名成一个不存在的名字，动画静默失效，且不报错。

### 规范

提交信息走 [Conventional Commits](https://www.conventionalcommits.org/)，
由 commitlint 在 `commit-msg` 钩子强制检查；`pre-commit` 对暂存文件跑 prettier。
详见 [CONTRIBUTING.md](CONTRIBUTING.md)，变更记录见 [CHANGELOG.md](CHANGELOG.md)。

```bash
pnpm format        # 格式化
pnpm format:check  # 只检查
pnpm build         # 构建
```

---

<div align="center">

悼念这件事，最好趁生前。

</div>
