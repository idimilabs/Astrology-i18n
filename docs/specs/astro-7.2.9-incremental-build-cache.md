# Astro 7.2.9 增量静态构建缓存规格

## 目标

将 Astro 升级至 `^7.2.9`，统一本地与未来 CI 的缓存目录配置，并保证内容驱动的动态静态路由使用稳定且完整的 `cacheKey`。连续构建时，未变化页面恢复缓存；CSS 变化时，受影响页面重新生成且 HTML 不引用缺失资源。

## 范围

- 更新 Astro 依赖与 pnpm 锁文件。
- 在 Astro 顶层配置中接入可选的 `ASTRO_CACHE_DIR`。
- 审核全部包含 `getStaticPaths()` 的动态静态路由及其缓存键。
- 更新 Astro 7 升级契约测试与项目构建说明。
- 执行连续构建、CSS 失效和输出资源完整性验证。

不新增 GitHub Actions、部署服务、缓存依赖或运行时服务；不提交、不推送、不部署。

## 验收标准

1. `package.json` 使用 `astro: ^7.2.9`，锁文件解析并安装 Astro 7.2.9 或更高的 7.2 补丁版本。
2. `astro.config.mjs` 顶层包含 `cacheDir: process.env.ASTRO_CACHE_DIR`，保留 `incrementalBuild` 与 `svgOptimizer`。
3. 内容驱动路由的缓存键覆盖实际渲染的内容、条目顺序和分页边界；404 与搜索页继续无缓存键。
4. 升级契约测试固定最低版本、增量开关、缓存目录和内容路由缓存键。
5. 文档明确本地默认缓存、CI 持久目录、一次性目录和冷构建命令。
6. 两次连续构建中，首页、文章详情、列表和 RSS 的未变化路径显示 `(restored)`。
7. 临时修改全局 CSS 后，受影响页面重新生成；所有 HTML 引用的 `/_astro/` 文件均存在。
8. 删除临时改动后，再次连续构建恢复稳定的 `(restored)` 状态。
9. 规定的安装、测试、构建、差异和状态检查全部通过。

## 影响面

- 构建依赖：`package.json`、`pnpm-lock.yaml`
- Astro 配置：`astro.config.mjs`
- 缓存契约：`scripts/verify-astro-7-upgrade.test.mjs`
- 内容路由：`src/pages/[lang]/` 下包含 `getStaticPaths()` 的页面与端点
- 工程说明：`AGENTS.md`

普通静态托管继续直接使用 `dist`，Cloudflare 保持可选，生产运行时行为不变。

## 验证命令

```bash
pnpm install --frozen-lockfile
pnpm test:upgrade
pnpm test:design
pnpm build
pnpm build
pnpm astro build --force
git diff --check
git status --short
```

CSS 失效验证在本地临时修改 `src/styles/global.css`，完成构建日志与 `/_astro/` 引用检查后立即恢复，不保留诊断代码。
