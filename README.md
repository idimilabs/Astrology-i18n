<div align="center">

# Astrology i18n — A Multilingual Astro Blog Theme

[![Astro](https://img.shields.io/badge/Astro-5-BC52EE?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node](https://img.shields.io/badge/Node-%E2%89%A5%2020-339933?logo=node.js)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A multilingual photo-and-prose theme built with Astro 5. Ships with 10 languages, per‑locale routes and dictionaries, SEO/JSON‑LD, per‑locale RSS, on‑site search, responsive images, and auto dark/light themes — ready for global storytelling.

<img src="public/screenshot.webp" alt="Astrology-i18n" />

[Live Demo](https://astrology-i18n.vercel.app/)

</div>

## Lighthouse

<p align="center">
  <a href="https://pagespeed.web.dev/analysis/https-astrology-yo7bu6q1-edgeone-app/nij513nbyr?form_factor=mobile">
    <img width="510" alt="Astrology-i18n Lighthouse" src="public/astrology-i18n-lighthouse-score.svg">
  </a>
  <br/>
Scores vary by content and network; treat as indicative.
  
</p>

## Showcase

- [**iDiMi**](https://idimi.com) — A blog about investing, entrepreneurship, and life.
- Using the theme? Open an issue titled "Showcase Submission" with your site URL and a screenshot to be featured.

## Features

- 🌐 **Internationalization**: Language‑prefixed routes at `/[lang]/` (default `zh`, also prefixed), centralized UI dictionaries in `src/i18n/*.json`, hreflang and multilingual sitemap.
- 🗂️ **Content Collections**: Post/Page/Author collections in `src/content.config.ts`; frontmatter validation; last‑modified time from Git.
- ✍️ **MDX Support**: `@astrojs/mdx` enabled across content and pages.
- 🖼️ **Images & Performance**: Local assets optimized via `astro:assets`; remote images don’t infer size by default (pass `width`/`height` or use local assets).
- ⚡ **Performance**: Link prefetching enabled (`prefetch.defaultStrategy = 'viewport'`).
- 🔎 **Search**: `astro-pagefind` with `/[lang]/search`.
- 📈 **SEO**: `astro-seo` + JSON‑LD; per‑language RSS at `/[lang]/rss.xml`; `robots.txt` and `@astrojs/sitemap`.
- 🎨 **Styling & Components**: Tailwind CSS v4 (+ Typography); multiple cards/layouts; light/dark toggle and auto detect; icon system via `astro-icon` (Tabler/MDI sets included).
- 📊 **Analytics‑ready**: Partytown integration forwarding `dataLayer.push` (no third‑party scripts enabled by default).
- 🧩 **Built‑ins**: pagination; tags & categories pages; author page; 404 page.

## Quick Start

Requirements: Node.js 20+, pnpm or npm.

```bash
# Install
npm install

# Develop (http://localhost:4321)
npm run dev

# Build & preview
npm run build
npm run preview
```

## Project Structure

```text
.
├─ astro.config.mjs               # site, images, i18n, integrations
├─ package.json                   # scripts and deps (Astro, Tailwind, MDX, etc.)
├─ tsconfig.json
├─ public/                        # static assets
├─ src/
│  ├─ pages/
│  │  ├─ index.astro              # root landing
│  │  ├─ robots.txt.ts
│  │  ├─ rss.xml.ts               # root RSS
│  │  └─ [lang]/
│  │     ├─ index.astro           # home
│  │     ├─ about.astro           # about page
│  │     ├─ author.astro          # author page
│  │     ├─ 404.astro             # localized 404
│  │     ├─ search.astro          # on‑site search
│  │     ├─ posts/
│  │     │  ├─ index.astro        # list
│  │     │  └─ [...slug].astro    # detail
│  │     ├─ tags/
│  │     │  ├─ index.astro
│  │     │  └─ [slug]/[page].astro
│  │     └─ category/
│  │        ├─ index.astro
│  │        └─ [slug]/[page].astro
│  ├─ content/
│  │  ├─ posts/<lang>/...         # Markdown/MDX posts
│  │  ├─ pages/<lang>/...         # static pages
│  │  └─ authors/<lang>/...       # author data
│  ├─ i18n/*.json                 # UI dictionaries
│  ├─ components/
│  │  ├─ analytics/               # Partytown/GTM slots
│  │  ├─ widgets/
│  │  ├─ features/
│  │  ├─ cards/
│  │  └─ ui/                      # header/footer/nav
│  ├─ layouts/                    # Main/Post/Landing
│  ├─ utils/                      # i18n, rss, date, remark
│  ├─ styles/                     # global.css
│  ├─ icons/                      # svg icons
│  └─ content.config.ts           # content collections
```

## Authoring Content (Frontmatter)

Create `.md`/`.mdx` under `src/content/posts/<lang>/`. Example:

```yaml
---
title: Post title
description: Short summary
category: Category
tags: [tag1, tag2]
pubDate: 2024-08-01
updatedDate: 2024-08-15 # optional; also injected from Git
author: Astro
heroImage: /path/or/https... # prefer local asset or provide dimensions
heroImageAlt: Cover image alt text
locales: zh # one of: zh/en/fr/es/ru/ja/ko/pt/de/id
draft: false
featured: false
---
```

Routing: after removing the language and extension, a post maps to `/{lang}/posts/<slug>/`.

## Internationalization

- Default language: `zh`; supported: `zh, en, fr, es, ru, ja, ko, pt, de, id`.
- Routing rules: default locale is also prefixed (`/zh/...`); no automatic redirect to default locale; missing pages use `fallbackType: 'rewrite'` (serves fallback content while keeping the requested locale URL).
- Fallback map: `en→zh`, `fr→zh`, `es→zh`, `ru→zh`, `ja→zh`, `ko→zh`, `pt→zh`, `de→zh`, `id→zh`.
- Add a new language:
  1. Add the code in `src/utils/i18n.ts` and `src/content.config.ts`;
  2. Create `src/i18n/<lang>.json`;
  3. Optionally update `astro.config.mjs` → `i18n.locales` and `i18n.fallback`.

## Built‑in Pages

- Root landing: `/` (language‑neutral landing page).
- Home: `/<lang>/` (e.g., `/en/`, `/zh/`).
- Posts listing: `/<lang>/posts/` with pagination `/<lang>/posts/<page>/`.
- Post detail: `/<lang>/posts/<slug>/` (from `src/content/posts/<lang>/*`).
- Tags: list at `/<lang>/tags/`; tag page `/<lang>/tags/<slug>/` (+ pagination).
- Categories: list at `/<lang>/category/`; category page `/<lang>/category/<slug>/` (+ pagination).
- Search: `/<lang>/search` (Pagefind UI).
- About: `/<lang>/about`.
- Author: `/<lang>/author`.
- 404: `/<lang>/404`.
- RSS: per‑language feed at `/<lang>/rss.xml`; root feed at `/rss.xml`.
- Robots: `/robots.txt`.

## GitHub Activity Calendar (with Private Contributions)

The writing activity calendar on the author page is powered by GitHub contribution data. The widget `src/components/widgets/GitHubActivityCalendar.astro` fetches contributions via GitHub GraphQL to include both public and private contributions when a token is provided. Without a token, it falls back to a public API and counts public contributions only.

- Env var: `GITHUB_TOKEN`
- Scope: server‑side only (read via `astro:env/server` → `getSecret('GITHUB_TOKEN')`)
- Fallback: uses a public contributions API when `GITHUB_TOKEN` is not set

Local development

- Create `.env` or `.env.local` at the project root
- Add:

```env
GITHUB_TOKEN=your_github_token
```

Production

- Add an environment variable on your hosting platform (Vercel / Netlify / Cloudflare / Dokploy / etc.):
  - Key: `GITHUB_TOKEN`
  - Value: your GitHub token (read‑only is enough). It should belong to the same GitHub user being displayed to include their private contribution counts.
- Redeploy to take effect

Usage

- The author page automatically extracts the GitHub username from social links and renders the contribution calendar above the “Latest Posts” section.
- Time windows supported by the component:
  - `year="last"`: rolling last 52 weeks (similar to the GitHub profile view)
  - `year={2024}`: fixed calendar year (Jan 1 – Dec 31)
- Note: GitHub’s profile view renders by local time, while GraphQL and build steps often use UTC; boundary dates may differ slightly.

## Sitemap & RSS

- Sitemap: Generated by `@astrojs/sitemap` with i18n enabled. Locale codes map to BCP‑47 tags (`zh→zh-CN`, `en→en-US`, `fr→fr-FR`, `es→es-ES`, `ru→ru-RU`, `ja→ja-JP`, `ko→ko-KR`, `pt→pt-PT`, `de→de-DE`, `id→id-ID`). Alternate `hreflang` links are included for localized routes.
- RSS: One feed per language at `/<lang>/rss.xml` (e.g., `/en/rss.xml`, `/zh/rss.xml`). Implemented in `src/pages/[lang]/rss.xml.ts` using helpers in `src/utils/rss.ts`.

## Deployment

- Static output is written to `dist/` and can be deployed to any static host (Vercel/Netlify/Cloudflare Pages, etc.).
- Set `site` in `astro.config.mjs` to your production URL to ensure correct absolute links (OG, sitemap, RSS).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Configuration Tips

- Remote images don’t infer dimensions by default. For `astro:assets` processing, pass explicit `width`/`height`, or use local images.
- `trailingSlash: 'always'`. Partytown forwards `dataLayer.push`; no third‑party scripts enabled by default.
- Per‑language RSS: `src/pages/[lang]/rss.xml.ts` + `src/utils/rss.ts`. Last modified time: `src/utils/remark-modified-time.mjs`.
- Remote image allowlist includes `*.unsplash.com` via `image.remotePatterns`.

## FAQ

- Why don’t remote images have sizes inferred?
  - To avoid build‑time network fetches failing your build. Provide `width`/`height` or use local assets.
- How do I add a new language safely?
  - Add codes in config, create the locale JSON, and run a full `npm run build` to validate all localized routes.
- Can I use npm instead of pnpm?
  - Yes. Replace `pnpm` with `npm` (e.g., `npm run dev`).
- Where is the search index built?
  - During `npm run build` via `astro-pagefind`.

## Comparison

| Feature                    | Astrology i18n         | Astro Blog Template | Typical Theme |
| -------------------------- | ---------------------- | ------------------- | ------------- |
| Built‑in i18n routes       | Yes (`/[lang]/...`)    | No                  | Varies        |
| Per‑language RSS           | Yes                    | No                  | Rare          |
| On‑site search             | Yes (`astro-pagefind`) | No                  | Varies        |
| SEO & JSON‑LD              | Yes (`astro-seo`)      | Basic               | Varies        |
| Tailwind v4                | Yes                    | Optional            | Varies        |
| MD/MDX Content Collections | Yes                    | Basic               | Varies        |

## Contributing

- Format before committing: `npx prettier -w .` (Astro + Tailwind plugins enabled).
- Prefer Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`.
- PRs: include a concise description, linked issues, before/after UI screenshots (if UI), and i18n impact (which locales affected).

## License

This project is licensed under the [MIT License](LICENSE.txt).
