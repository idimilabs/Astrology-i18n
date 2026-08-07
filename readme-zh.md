# Polyglow 中文说明

[English README](README.md)

Polyglow 是一个静态优先的 Astro 7 多语言内容主题。项目内置语言前缀路由、内容集合、分类和标签归档、作者页、Pagefind 搜索、RSS、站点地图、基于 `astro-seo` 的 SEO 元数据、JSON-LD、Astro 图片优化、明暗主题、Astro 视图过渡，以及可选的 Cloudflare Workers Static Assets 部署。

普通静态托管不需要数据库、私有服务、统计账号、广告账号、钱包或 Cloudflare 凭据。

## 评分

| Lighthouse | Agent Readiness |
| --- | --- |
| [![Polyglow Lighthouse 评分](public/lighthouse-score---https---polyglow-zbz-ai.svg)](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fpolyglow.zbz.ai%2F) | [![Polyglow Agent Readiness 评分](public/agent-readiness-https---polyglow-zbz-ai.avif)](https://isitagentready.com/polyglow.zbz.ai) |

## 特性

- 🧱 静态优先的 Astro 7 架构，不强制依赖 CMS、数据库或私有运行时服务。
- 🌐 Astro 原生 i18n，支持 11 种语言、语言前缀路由、RTL、`hreflang` 和多语言站点地图。
- 📝 Markdown 和 MDX 内容集合，覆盖文章、页面、作者、分类、标签和分页归档，并通过 Astro 的 Satteri 管线处理。
- 🧭 内置 RSS、站点地图、robots.txt、SEO 元数据、JSON-LD 和面向代理的发现文件。
- 🔎 基于 Pagefind 的静态全文搜索。
- 🎨 Tailwind CSS v4 设计系统，使用 CSS-first 主题变量、明暗主题和长文排版。
- 🖼️ Astro 图片优化，支持响应式布局和现代 AVIF/WebP 输出。
- ✨ Astro 视图过渡和 hover 链接预获取。
- ⚙️ Astro 7 托管后台开发服务器和 JSON 日志命令，便于代理工作流使用。
- 🔤 面向 CJK 的排版优化，支持 `text-autospace`，并支持阿拉伯语 RTL 布局。
- 💻 基于 Expressive Code 的代码高亮，支持明暗主题。
- 📣 可选 Google AdSense 和 Google Tag Manager，GTM 通过 Partytown 加载。
- 💸 可选 x402，包含静态元数据和 Cloudflare Worker 网关。
- 🤖 Agent-Native 发布界面，包含 `llms.txt`、`llms-full.txt`、`openapi.json`、`auth.md`、robots.txt 和站点地图。
- 📊 作者页 Writing Activity 热力图和以图片为核心的动态玻璃视觉。

## 验证示例

- 生产站点曾在 PageSpeed Insights 实验室测试中达到 Lighthouse 四项 100 分：
  [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fpolyglow.zbz.ai%2F)。
- 面向代理的发布界面按
  [Is Your Site Agent-Ready?](https://isitagentready.com/polyglow.zbz.ai)
  的发现能力、内容访问、bot 访问、协议发现和商务检查设计。

## 环境要求

- Node.js 24 或更新版本
- pnpm

## 开始

```bash
pnpm install
pnpm dev
```

Astro 会输出本地访问地址。根入口跳转到英文默认语言：

```text
http://localhost:4321/en/
```

## 常用命令

```bash
pnpm dev      # 本地开发
pnpm dev:background # 启动 Astro 托管后台开发服务器
pnpm dev:status     # 查看后台开发服务器状态
pnpm dev:logs       # 查看后台开发服务器日志
pnpm dev:stop       # 停止后台开发服务器
pnpm dev:json       # 以 JSON 日志启动开发服务器
pnpm build    # 运行 astro check 并构建静态产物
pnpm test:upgrade # 验证 Astro 7 升级契约
pnpm preview  # 本地预览构建产物
pnpm deploy   # 构建后通过 Wrangler 部署 dist
```

升级到 Astro 7 后，配置继续保留 `compressHTML: true`，保证现有主题延续
Astro 6 风格的 HTML 空白行为。Astro 7 的 Rust 编译器、队列渲染、
Advanced Routing 和 Satteri Markdown 管线均使用正式默认能力，不再配置
Astro 6 的 `rustCompiler`、`queuedRendering` 实验开关。
Astro 7.1 已为 Markdown 内容集合启用延迟渲染，以降低内容同步时的内存占用；
`pnpm dev:parallel -- --port <端口>` 可启动一个独立的第二开发服务器。

## 项目结构

```text
astro.config.mjs             # Astro、i18n、图片、sitemap 和集成配置
src/config/                  # 站点、语言、分类标签、分页和资源配置
src/content/                 # 作者、页面和文章内容
src/pages/                   # 多语言路由和生成端点
src/layouts/main.astro       # 共享页面壳、SEO、组件、页头和页脚
src/components/              # 卡片、布局、导航、搜索、组件和图标
src/integrations/pagefind.ts # Pagefind 构建和开发集成
src/styles/global.css        # 运行时 Tailwind v4 主题和组件 CSS
```

## 路由和语言

已配置语言：

```text
en zh fr es ru ja ko pt de id ar
```

`en` 是默认语言。公开页面使用语言前缀，并保留结尾斜杠：

```text
/en/
/en/posts/
/en/posts/<slug>/
/en/category/
/en/category/<slug>/
/en/tags/
/en/tags/<slug>/
/en/author/
/en/search/
/en/rss.xml
```

中文内容继续保留在 `/zh/`。阿拉伯语页面通过语言元数据启用 RTL 方向。

## 写内容

内容位于 `src/content`：

```text
src/content/
  authors/<locale>/
  pages/<locale>/
  posts/<locale>/
```

文章示例：

```text
src/content/posts/en/my-post.mdx
src/content/posts/zh/my-post.mdx
```

文章 frontmatter：

```yaml
---
title: "Post title"
description: "Short summary for cards and SEO."
category: "build"
tags: ["strategy"]
pubDate: 2026-05-12
updatedDate: 2026-05-12
authors: ["default"]
heroImage: "/open-graph.webp"
heroImageAlt: "Image alt text"
locale: "en"
draft: false
featured: false
---
```

可选 SEO 字段：

```yaml
seoTitle: "Custom title"
seoDescription: "Custom meta description."
canonical: "https://example.com/original/"
heroBlurDataURL: "data:image/..."
```

远程 `heroImage` 需要同时填写 `heroImageWidth` 和 `heroImageHeight`。远程图片域名限制为 Unsplash 和可选的 `PUBLIC_ASSET_BASE_URL` 域名。

更换图床时，需要在 `src/config/site.ts` 中同步放行新的 HTTPS 图片域名：

```js
assets: {
  publicBaseUrl: publicAssetBaseUrl,
  remotePatterns: [
    ...(publicAssetHost
      ? [{ protocol: "https", hostname: publicAssetHost }]
      : []),
    { protocol: "https", hostname: "*.unsplash.com" },
    { protocol: "https", hostname: "*.zbz.ai" },
  ],
}
```

根据内容图片实际使用的域名增删这些条目。

## 配置

多数用户只需要修改 `src/config/site.ts`：

```text
src/config/site.ts       # 站点名、域名、描述、仓库、社交链接、首页、资源、统计、广告、x402
src/config/locales.ts    # 语言列表、默认语言、hreflang、文字方向
src/config/taxonomy.ts   # 分类、标签、多语言名称、slug 工具
src/config/pagination.ts # 分页数量
src/i18n/*.json          # 界面语言文案
```

环境变量是可选的部署覆盖项，适合不同环境使用不同域名或第三方服务：

```bash
PUBLIC_SITE_URL=https://example.com
PUBLIC_ASSET_BASE_URL=https://assets.example.com
```

可选集成默认关闭：

```bash
PUBLIC_GTM_ENABLED=true
PUBLIC_GTM_ID=GTM-XXXXXXX

PUBLIC_ADSENSE_ENABLED=true
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000

PUBLIC_X402_ENABLED=true
PUBLIC_X402_PAY_TO=YourWalletAddress
PUBLIC_X402_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
PUBLIC_X402_PRICE=$0.08
PUBLIC_X402_DESCRIPTION=Voluntary x402 payment support for Polyglow content.
PUBLIC_X402_FACILITATOR_URL=https://x402.org/facilitator
PUBLIC_X402_CHARGE_MODE=all
PUBLIC_X402_BOT_SCORE_THRESHOLD=30
```

`PUBLIC_X402_CHARGE_MODE` 支持 `all` 和 `bot-only`。x402 组件只发布元数据，不执行 HTTP 402 支付拦截。

## 可选 x402 网关

Polyglow 默认构建仍是静态站，普通静态托管照常可用。真正执行 x402 收费需要运行时适配器，在返回静态资源之前先返回 `402 Payment Required`。

仓库内置了可选的 Cloudflare Workers 适配器：

```text
src/x402/cloudflare-worker.ts
```

默认关闭：

```bash
X402_ENABLED=false
```

在 Cloudflare Workers Static Assets 上启用时，在 Wrangler 或 Cloudflare 后台设置运行时变量：

```bash
X402_ENABLED=true
X402_PAY_TO=YourWalletAddress
X402_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
X402_PRICE=$0.08
X402_FACILITATOR_URL=https://x402.org/facilitator
X402_BOT_ONLY=true
X402_BOT_SCORE_THRESHOLD=30
```

`X402_PAY_TO` 设为运行时 Secret，其他值设为运行时变量。`x402.org`
facilitator 当前公布的 Solana 支持网络是
`solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`。更换 facilitator 时，
`X402_NETWORK` 必须使用该 facilitator 的 `/supported` 接口返回的网络值。

Cloudflare 部署时，`/api`、`/api/v1` 和各语言文章页会进入适配器。启用网关后，API 探测路由始终要求支付；文章页在 `X402_BOT_ONLY=true` 时只对 bot 收费。不支持运行时适配器的平台仍可发布静态站和可选 x402 元数据，但不能执行支付拦截。

生产部署验证命令：

```bash
curl -i https://your-domain.example/api
curl -i https://your-domain.example/api/v1
```

网关启用后，两条请求都返回 `402 Payment Required`，并带有
`payment-required` 响应头。Polyglow 生产环境已在
`https://polyglow.zbz.ai/api` 和
`https://polyglow.zbz.ai/api/v1` 验证通过。

## Agent API 发现

Polyglow 发布静态 API 发现文件，供代理自动读取：

- `/.well-known/api-catalog` 发布 RFC 9727 API Catalog，包含 `/api` 和
  `/api/v1` 的 linkset 条目。
- `/openapi.json` 描述受 x402 保护的 API 探测端点。
- `/auth.md` 说明代理访问方式和 x402 支付流程。
- `/.well-known/oauth-authorization-server`、`/.well-known/openid-configuration`
  和 `/.well-known/oauth-protected-resource` 为需要 OAuth/OIDC 文档的代理发布发现元数据。

当前公开访问路径仍是 x402 支付。静态 OAuth/OIDC 文件仅作为发现元数据；本仓库默认不签发 bearer token，也不管理用户账号。

通过 Worker 适配器部署时，带有 `Accept: text/markdown` 的请求会收到 Markdown 表示，响应包含 `Content-Type: text/markdown` 和 `x-markdown-tokens`。浏览器请求继续返回正常 HTML。

## 设计

`DESIGN.md` 记录当前视觉令牌和 UI 规则。实际运行时主题在 `src/styles/global.css` 中实现。

## 开发流程

Polyglow 的开发只使用仓库文档、GitHub Issues 和 GitHub Projects。飞书、Lark、Meegle、飞书项目和飞书知识库不再作为 Polyglow 的开发工具。

- `AGENTS.md`、`DESIGN.md`、本 README、`README.md` 和 `docs/` 是项目文档来源。
- GitHub Issues 是 bug、功能和任务的唯一事实来源。
- GitHub Projects 用于状态、优先级、顺序和交付跟踪。
- 非简单修改采用 Spec-Driven Development：在编码前或编码同时写清 issue、验收标准、实现说明和验证命令。
- 有意义的 commit、pull request 或最终交接说明引用对应 issue。

## 搜索和 SEO

Pagefind 由 `src/integrations/pagefind.ts` 在构建阶段生成。当前索引范围包含各语言 about 页面和文章详情页。每个支持语言都会生成独立的 `/pagefind/<locale>/` 搜索包，便于多语言站点只更新对应语言的搜索 fragment。

`src/layouts/main.astro` 使用 `astro-seo` 输出标准 SEO 元数据，项目自有 JSON-LD 生成保留在 `src/utils/structured-data.ts`。`x-default` 指向英文默认语言。

## 部署

构建产物位于 `dist`。

```bash
pnpm build
```

Polyglow 可以发布到任意静态托管平台，包括 Cloudflare Pages、Vercel、Netlify、GitHub Pages 或普通 Web 服务器。项目还保留了可选的 Workers Static Assets 部署方式：

```bash
pnpm deploy
```

## 反馈

疑问、建议和 bug 反馈请提交到 [GitHub Issues](https://github.com/zbzailabs/Polyglow/issues)。

## 许可证

MIT。详见 [LICENSE](LICENSE)。
