# 参与 RIP

这是一个很小的项目，规范也尽量小。下面是全部要求。

## 开发环境

- Node.js 20+
- pnpm 11.5.3+
- Git

```bash
pnpm install          # 会自动装好 husky 钩子（prepare 脚本）
pnpm dev          # 纯前端，端口 5173
pnpm api          # 带后端与 D1 的本地服务，端口 8788
```

日常开发开两个终端分别跑 `dev` 和 `api`，打开 <http://localhost:5173>，
Vite 会把 `/api` 代理到 8788，前后端都是真的。

## 分支

`main` 是发布分支，不直接往上推。从 `main` 切出来做事：

| 用途     | 前缀        | 例子                    |
| -------- | ----------- | ----------------------- |
| 新功能   | `feature/`  | `feature/flower-count`  |
| 缺陷修复 | `fix/`      | `fix/blank-first-paint` |
| 文档     | `docs/`     | `docs/deploy-guide`     |
| 重构     | `refactor/` | `refactor/page-scene`   |
| 杂项     | `chore/`    | `chore/bump-wrangler`   |

## 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/)，由 commitlint 在
`commit-msg` 钩子里强制检查（规则见 [commitlint.config.js](commitlint.config.js)）。

```
<type>(<scope>): <subject>

<body>

<footer>
```

**type**（必填，小写）：

| type       | 用途                       |
| ---------- | -------------------------- |
| `feat`     | 新功能                     |
| `fix`      | 缺陷修复                   |
| `docs`     | 只动文档                   |
| `style`    | 格式调整，不影响行为       |
| `refactor` | 重构，既不加功能也不修 bug |
| `perf`     | 性能                       |
| `test`     | 测试                       |
| `build`    | 构建、依赖                 |
| `ci`       | CI 配置                    |
| `chore`    | 其他杂项                   |
| `revert`   | 回滚                       |

**scope**（建议填）：按本项目的结构取 `bei` `yuan` `yan` `login` `init` `api` `db` `ui` `deps`。

**subject**：一句话说清做了什么，句首不大写，结尾不加句号，整行不超过 100 字符。

示例：

```
feat(yan): 留言支持署名

- 写信栏加上名字输入框，最长 12 字
- 后端 voices 表增加 name 列，空值存为「匿名」
- 补 migration 0003

Closes #12
```

```
fix(bei): 修复首屏白屏

App.vue 的 views 映射引用了未 import 的 LoginView，setup 阶段抛 ReferenceError
导致整个应用挂载失败。构建不会报错，因为 Vite 只解析 import，不查未定义标识符。
```

## 代码风格

- Vue 3 Composition API，一律 `<script setup>`
- 2 空格缩进、单引号、不加分号、行宽 100 —— 由 prettier 统一，不必手调
- 注释写「为什么」，不写「是什么」；踩过的坑要留下记录（见 `src/styles/page.css` 的文件头）
- 组件 PascalCase，组合式函数 `useXxx`
- 样式：先看 `src/styles/` 下的共享样式，同一条规则不要写第二遍

共享样式有两条硬约束，改之前务必读一遍 [src/styles/page.css](src/styles/page.css) 的文件头：

1. 全局选择器必须圈在命名空间下（`.page`），裸类名会泄漏到同名的类上
2. 用到共享 `@keyframes` 的 `animation` 声明必须也留在全局文件里 ——
   Vue 的 scoped 样式会给关键帧加组件哈希，写回 scoped 里会静默失效

## 提交前

`pre-commit` 钩子会对暂存文件跑 prettier。手动检查：

```bash
pnpm format:check
pnpm build
```

改了后端就顺手跑一次 `pnpm api`，用 curl 打一遍受影响的接口。

不建议用 `--no-verify` 跳过钩子。

## 数据库

改表结构要加 migration，不要改历史文件：

```bash
# 新建 migrations/000X_你的改动.sql，然后
pnpm exec wrangler d1 migrations apply rip-db --local     # 本地
pnpm exec wrangler d1 migrations apply rip-db --remote    # 线上
```

`functions/api/init.js` 里的空库自举建表语句要跟着一起更新，两条路径的 schema 必须一致。

想从零走一遍初始化流程：停掉 `api`，删掉 `.wrangler/state/v3/d1`，重启。

## 变更记录

面向用户的改动要写进 [CHANGELOG.md](CHANGELOG.md) 的 `[Unreleased]` 段，
格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。
纯内部重构、依赖升级可以不写。
