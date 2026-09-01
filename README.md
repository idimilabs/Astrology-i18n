# Polyglow

[中文说明](readme-zh.md)

Polyglow is a static-first Astro 7 theme for multilingual editorial publishing.
It ships locale-prefixed routes, content collections, category and tag archives,
author pages, Pagefind search, RSS, sitemap output, SEO metadata through
`astro-seo`, JSON-LD, Astro image optimization, light/dark themes, Astro view
transitions, and optional Cloudflare Workers Static Assets deployment.

The theme works without a database, private service, analytics account, ad
account, wallet, or Cloudflare credentials.

## Scores

| Lighthouse | Agent Readiness |
| --- | --- |
| [![Polyglow Lighthouse score](public/lighthouse-score---https---polyglow-zbz-ai.svg)](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fpolyglow.zbz.ai%2F) | [![Polyglow Agent Readiness score](public/agent-readiness-https---polyglow-zbz-ai.avif)](https://isitagentready.com/polyglow.zbz.ai) |

## Features

- 🧱 Static-first Astro 7 architecture with no required CMS, database, or private
  runtime service.
- 🌐 Astro-native i18n with 11 locales, locale-prefixed routes, RTL support,
  `hreflang`, and multilingual sitemap output.
- 📝 Markdown and MDX content collections for posts, pages, authors, categories,
  tags, and paginated archives, processed through Astro's Satteri pipeline.
- 🧭 Built-in RSS, sitemap, robots.txt, SEO metadata, JSON-LD, and agent-facing
  discovery files.
- 🔎 Pagefind-powered static full-text search.
- 🎨 Tailwind CSS v4 design system with CSS-first tokens, light/dark themes, and
  long-form typography.
- 🖼️ Astro image optimization with responsive layouts and modern AVIF/WebP output.
- ✨ Astro view transitions and hover-based link prefetching.
- ⚙️ Astro 7 managed background dev server and JSON log commands for agent
  workflows.
- 🔤 CJK-friendly typography with `text-autospace` support and Arabic RTL layout.
- 💻 Expressive code blocks with light and dark syntax themes.
- 📣 Optional Google AdSense and Google Tag Manager integration, with GTM loaded
  through Partytown.
- 💸 Optional x402 support through static metadata and a Cloudflare Worker gateway.
- 🤖 Agent-native publishing surface with `llms.txt`, `llms-full.txt`,
  `openapi.json`, `auth.md`, robots.txt, and sitemap.
- 📊 Author Writing Activity heatmap and image-led dynamic glass UI.

## Verification Examples

- The production site has reached 100 scores across the four PageSpeed
  Insights Lighthouse categories in lab testing:
  [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fpolyglow.zbz.ai%2F).
- The agent-facing surface is designed for
  [Is Your Site Agent-Ready?](https://isitagentready.com/polyglow.zbz.ai) checks across
  discoverability, content access, bot access, protocol discovery, and commerce.

## Requirements

- Node.js 24 or newer
- pnpm

## Start

```bash
pnpm install
pnpm dev
```

Astro prints the local URL. The root entry redirects to the English locale:

```text
http://localhost:4321/en/
```

## Commands

```bash
pnpm dev      # Start local development
pnpm dev:background # Start Astro's managed background dev server
pnpm dev:status     # Check background dev server status
pnpm dev:logs       # Read background dev server logs
pnpm dev:stop       # Stop the background dev server
pnpm dev:json       # Start dev server with JSON logs
pnpm build    # Run astro check and build static output
pnpm test:upgrade # Verify the Astro 7 upgrade contract
pnpm preview  # Preview the built site locally
pnpm deploy   # Build, then deploy dist with Wrangler
```

The configuration keeps `compressHTML: true` after the Astro 7 upgrade so the
existing theme keeps Astro 6 style HTML whitespace behavior. Astro 7's Rust
compiler, queued rendering, advanced routing, and Satteri Markdown pipeline are
used as stable defaults without the removed Astro 6 experimental flags.
Astro 7.1 defers Markdown rendering for lower content-sync memory usage, and
`pnpm dev:parallel -- --port <port>` starts an independent second dev server.

## Project Structure

```text
astro.config.mjs             # Astro, i18n, image, sitemap, and integration config
src/config/                  # Site, locale, taxonomy, pagination, and asset config
src/content/                 # Authors, pages, and posts
src/pages/                   # Localized routes and generated endpoints
src/layouts/main.astro       # Shared shell, SEO, widgets, header, and footer
src/components/              # Cards, layout, navigation, search, widgets, and icons
src/integrations/pagefind.ts # Pagefind build and dev integration
src/styles/global.css        # Runtime Tailwind v4 theme and component CSS
```

## Routes and Locales

Configured locales:

```text
en zh fr es ru ja ko pt de id ar
```

`en` is the default locale. Public pages are locale-prefixed and keep trailing
slashes:

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

Chinese content remains available under `/zh/`. Arabic routes use RTL layout
through locale metadata.

## Write Content

Content lives in `src/content`:

```text
src/content/
  authors/<locale>/
  pages/<locale>/
  posts/<locale>/
```

Post example:

```text
src/content/posts/en/my-post.mdx
src/content/posts/zh/my-post.mdx
```

Post frontmatter:

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

Optional SEO fields:

```yaml
seoTitle: "Custom title"
seoDescription: "Custom meta description."
canonical: "https://example.com/original/"
heroBlurDataURL: "data:image/..."
```

Remote `heroImage` values must include `heroImageWidth` and
`heroImageHeight`. Remote image hosts are limited to Unsplash and the optional
`PUBLIC_ASSET_BASE_URL` host.

When replacing the image host, keep Astro image optimization in sync by allowing
the new HTTPS host in `src/config/site.ts`:

```js
assets: {
  remotePatterns: [
    ...(publicAssetHost
      ? [{ protocol: "https", hostname: publicAssetHost }]
      : []),
    { protocol: "https", hostname: "*.unsplash.com" },
    { protocol: "https", hostname: "*.zbz.ai" },
  ],
}
```

Add or replace entries to match the hosts used by your content images.

## Configure

Most users only need `src/config/site.ts`:

```text
src/config/site.ts       # Site name, URL, description, repository, social links, homepage, assets, analytics, ads, x402
src/config/locales.ts    # Locale list, default locale, hreflang, direction
src/config/taxonomy.ts   # Categories, tags, localized labels, slug helpers
src/config/pagination.ts # Page sizes
src/i18n/*.json          # Interface text
```

Environment variables are optional deployment overrides for values that often
change by environment:

```bash
PUBLIC_SITE_URL=https://example.com
PUBLIC_ASSET_BASE_URL=https://assets.example.com
```

Optional integrations are disabled by default:

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

`PUBLIC_X402_CHARGE_MODE` accepts `all` or `bot-only`. The x402 widget only
publishes metadata; it does not enforce HTTP 402 payment.

## Optional x402 Gateway

Polyglow's default build remains static and works on ordinary static hosting.
Real x402 enforcement needs a runtime adapter that can return
`402 Payment Required` before serving static assets.

The repository includes an optional Cloudflare Workers adapter at
`src/x402/cloudflare-worker.ts`. It is disabled by default:

```bash
X402_ENABLED=false
```

To enable it on Cloudflare Workers Static Assets, set runtime variables in
Wrangler or the Cloudflare dashboard:

```bash
X402_ENABLED=true
X402_PAY_TO=YourWalletAddress
X402_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
X402_PRICE=$0.08
X402_FACILITATOR_URL=https://x402.org/facilitator
X402_BOT_ONLY=true
X402_BOT_SCORE_THRESHOLD=30
```

`X402_PAY_TO` should be set as a runtime secret. The other values can be
runtime variables. The `x402.org` facilitator currently advertises Solana
support for `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`; if a different
facilitator is used, set `X402_NETWORK` to one of the networks returned by its
`/supported` endpoint.

`/api`, `/api/v1`, and localized post routes are routed through the adapter on
Cloudflare. The API probe routes always require payment when the gateway is
enabled; post routes charge bots when `X402_BOT_ONLY=true`. Platforms without a
runtime adapter can still publish the static site and optional x402 metadata,
but they cannot enforce payment.

Verify a production deployment with:

```bash
curl -i https://your-domain.example/api
curl -i https://your-domain.example/api/v1
```

Both requests should return `402 Payment Required` with a `payment-required`
header when the gateway is enabled. For Polyglow production, this has been
verified on `https://polyglow.zbz.ai/api` and
`https://polyglow.zbz.ai/api/v1`.

## Agent API Discovery

Polyglow publishes static API discovery files for agents:

- `/.well-known/api-catalog` exposes an RFC 9727 API catalog with linkset
  entries for `/api` and `/api/v1`.
- `/openapi.json` describes the x402 protected API probes.
- `/auth.md` explains agent access and x402 payment flow.
- `/.well-known/oauth-authorization-server`,
  `/.well-known/openid-configuration`, and
  `/.well-known/oauth-protected-resource` publish discovery metadata for
  agents that expect OAuth/OIDC documents.

The current public access path is still x402 payment. The static OAuth/OIDC
documents are discovery metadata; this repository does not issue bearer tokens
or manage user accounts by default.

When deployed through the Worker adapter, requests with
`Accept: text/markdown` receive a Markdown representation with
`Content-Type: text/markdown` and `x-markdown-tokens`. Browser requests keep
the normal HTML response.

## Design

`DESIGN.md` records the current visual tokens and UI rules. The live runtime
theme is implemented in `src/styles/global.css`.

## Development Workflow

Polyglow development uses repository documentation, GitHub Issues, and GitHub
Projects. Feishu, Lark, Meegle, Feishu Project, and Feishu Wiki are not part of
the Polyglow development workflow.

- Use `AGENTS.md`, `DESIGN.md`, this README, `readme-zh.md`, and `docs/` as the
  project documentation source.
- Use GitHub Issues as the source of truth for bugs, features, and tasks.
- Use GitHub Projects for status, priority, sequencing, and delivery tracking.
- Use Spec-Driven Development for non-trivial changes: capture the issue,
  acceptance criteria, implementation notes, and verification commands before or
  alongside the code.
- Reference the relevant issue in meaningful commits, pull requests, or final
  handoffs.

## Search and SEO

Pagefind is generated at build time by `src/integrations/pagefind.ts`. The
current index covers localized about pages and post detail pages. Each supported
locale gets its own `/pagefind/<locale>/` search bundle, so multilingual sites
can update language-specific search fragments without rewriting one global
Pagefind package.

`src/layouts/main.astro` uses `astro-seo` for standard SEO metadata and keeps
project-owned JSON-LD generation in `src/utils/structured-data.ts`. `x-default`
points to the English default locale.

## Deploy

The build output is `dist`.

```bash
pnpm build
```

Polyglow can be published to any static host, including Cloudflare Pages,
Vercel, Netlify, GitHub Pages, or a plain web server. The repository also
includes optional Workers Static Assets deployment:

```bash
pnpm deploy
```

## Feedback

Questions, ideas, and bug reports go to
[GitHub Issues](https://github.com/zbzailabs/Polyglow/issues).
