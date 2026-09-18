# 墓 · RIP

给自己的极简黑白数字墓碑。Vue 3 + Vite，后端为 Cloudflare Pages Functions + D1。

## 运行

```bash
npm install
npm run dev     # 纯前端页面（留言/清单会显示「暂时读不出来」）
npm run api     # 编译并启动带后端的本地服务（http://localhost:8788）
```

本地开发推荐：两个终端分别跑 `npm run api` 和 `npm run dev`，然后打开
http://localhost:5173 —— Vite 会把 `/api` 代理到 8788，前后端都是真的。

## 页面

底部「碑 · 愿 · 言」三个字是导航（对应 `#/bei`、`#/yuan`、`#/yan`）：

- **碑** —— 主页：石碑刻字、烛火点灭、献白花
- **愿** —— 遗愿清单：访客只读；解锁后可增/勾/删
- **言** —— 留言：访客可写（同 IP 60 秒一条）；解锁后可删

「解锁管理」按钮就在清单/留言板的右上角，输入 `ADMIN_TOKEN` 即可，
会话存在 sessionStorage 里，关浏览器失效。本地令牌在 [.dev.vars](.dev.vars)。

## 改文字

- 碑页文案：[src/epitaph.js](src/epitaph.js)（顶端小字、名字、生卒、墓志铭、英文注、背景巨字）
- 愿望与留言：数据都在 D1 数据库里，通过页面或管理接口维护

## 后端与部署（Cloudflare Pages + D1）

1. `npx wrangler login`
2. `npx wrangler d1 create rip-db`，把输出的 `database_id` 填进 [wrangler.toml](wrangler.toml)
3. 建表：`npx wrangler d1 migrations apply rip-db --remote`
4. （可选）把本地开发时攒的数据搬到远程：
   `npx wrangler d1 export rip-db --local --output data.sql`
   然后 `npx wrangler d1 execute rip-db --remote --file data.sql`
5. Cloudflare 面板 → Workers & Pages → 连接本仓库创建 Pages 项目（构建命令 `npm run build`，输出目录 `dist`）
6. 项目设置 → Functions → D1 绑定：变量名 `DB` → 选择 `rip-db`
7. 项目设置 → 环境变量：添加 `ADMIN_TOKEN`（自定义一个长随机串）
8. 之后每次 push 自动上线

## 管理接口（curl 示例）

```bash
# 校验令牌
curl -X POST https://你的域名/api/admin/verify -H "X-Admin-Token: $TOKEN"
# 删除某条留言
curl -X DELETE https://你的域名/api/voices/3 -H "X-Admin-Token: $TOKEN"
```
