# Changelog

本文件记录 RIP 所有值得留意的变更。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

- **管理密码流程**：首次打开站点时设置管理密码，加盐 SHA-256 存入 D1 的 `settings` 表；
  新增 `/api/init`、`/api/status` 两个接口与「初始化」「储存库未配置」两个引导页
- **登录页**：`/login`，登录态存 localStorage，页内可登出。故意不做界面入口，直接访问地址
- **留言署名**：写信栏可填名字（最长 12 字），留空存为「匿名」；新增 migration `0003`
- **白屏兜底**：`app.config.errorHandler` 与 mount 的 try/catch，组件抛错时显示一行提示
  而不是纯白页面
- **手机端提交按钮**：「愿」在窄屏下显示整宽按钮，不再只能按回车
- 项目图标、README、贡献指南与提交规范（commitlint + husky + lint-staged + prettier）

### Changed

- **路由改为 vue-router**：从自实现的 hash 路由迁到 history 模式，`/bei` `/yuan` `/yan`
  `/login`；旧的 `#/xxx` 链接会自动跳转到新地址
- **管理鉴权换成数据库密码**：不再使用 `ADMIN_TOKEN` 环境变量
- **抽出共享组件与样式**：新增 `PageScene`（页面外壳）、`AddBar`（写入栏），
  共享样式拆为 `page.css`（版式）与 `form.css`（表单），三个引导页的样式从 ~330 行降到 ~30 行
- `/api/voices` 额外返回 `total`，留言数不再因列表上限 200 而停住
- 尘埃粒子数量随屏幕收放，声明 `prefers-reduced-motion` 时不再渲染

### Fixed

- **首屏白屏**：`App.vue` 的 `views` 映射引用了未 import 的 `LoginView`，setup 阶段抛
  `ReferenceError` 导致整个应用挂载失败
- **导航失效**：`main.js` 把 `#/yuan` 重定向为 `/yuan`，而 `App.vue` 仍在读 hash，
  页面永远停在「碑」
- **登录不可用**：`admin.js` 未导出 `setToken`，登录页提交时抛 `TypeError`
- 所有增删改请求补上 `try/catch` 与超时，网络异常不再变成 unhandled rejection
- `AbortSignal.timeout` 在旧浏览器上抛错被吞成「网络出错」，改为退回 `AbortController`
- 未绑定 D1 时 `/api/wishes`、`/api/voices` 裸 500，改为返回 503 `no_db`
- `init.js` 把内部异常细节返回给前端，改为只记日志
- 登录重定向未校验，`?redirect=//evil.com` 可被利用
- 补上缺失的 migration `0002`（`settings` 表），修正编号断档

### Security

- 管理令牌比对改为定长比较
- 四份重复的 `verifyAdmin` 合并到 `functions/api/_lib/admin.js`

## [0.1.0] - 2026-09-18

首个版本。

### Added

- **碑**：石碑刻字、烛火点灭、点击献白花、飘落的尘埃
- **愿**：遗愿清单，访客只读，管理员可增删改
- **言**：留言板，访客可写，管理员可删；同 IP 60 秒一条、24 小时 5 条，
  蜜罐字段与链接过滤
- Cloudflare Pages Functions + D1 后端，`migrations/` 管理表结构
- 碑面文案集中在 `src/epitaph.js`

[unreleased]: https://github.com/abloom25/Headstone/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/abloom25/Headstone/releases/tag/v0.1.0
