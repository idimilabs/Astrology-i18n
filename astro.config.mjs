import mdx from "@astrojs/mdx"
import partytown from "@astrojs/partytown"
import sitemap from "@astrojs/sitemap"
import { satteri } from "@astrojs/markdown-satteri"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, svgoOptimizer } from "astro/config"
import icon from "astro-icon"
import pagefind from "./src/integrations/pagefind.ts"
import { SITE_CONFIG } from "./src/config/site.ts"

const googleTagManagerEnabled =
  SITE_CONFIG.analytics.googleTagManager.enabled &&
  Boolean(SITE_CONFIG.analytics.googleTagManager.containerId)
const sitemapLocaleMap = {
  en: "en-US",
  zh: "zh-CN",
  fr: "fr-FR",
  es: "es-ES",
  ru: "ru-RU",
  ja: "ja-JP",
  ko: "ko-KR",
  pt: "pt-PT",
  de: "de-DE",
  id: "id-ID",
  ar: "ar",
}
const sitemapExcludedPathPatterns = [
  /^\/$/,
  /\/404\/$/,
  /\/search\/$/,
  /\/rss\.xml\/$/,
  /\/tags\/market\/$/,
  /\/posts\/placeholder-[^/]+\/$/,
]

export default defineConfig({
  output: "static",
  cacheDir: process.env.ASTRO_CACHE_DIR,
  site: SITE_CONFIG.url,
  trailingSlash: "always",
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "fr", "es", "ru", "ja", "ko", "pt", "de", "id", "ar"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
    remotePatterns: SITE_CONFIG.assets.remotePatterns,
  },
  markdown: {
    processor: satteri(),
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      wrap: true,
    },
  },
  experimental: {
    incrementalBuild: true,
    svgOptimizer: svgoOptimizer({
      multipass: true,
      floatPrecision: 2,
      plugins: ["preset-default"],
    }),
  },
  integrations: [
    ...(googleTagManagerEnabled
      ? [
          partytown({
            config: {
              forward: ["dataLayer.push"],
            },
          }),
        ]
      : []),
    icon({
      include: {
        lucide: [
          "arrow-left",
          "chevron-down",
          "chevron-left",
          "chevron-right",
          "eye",
          "github",
          "globe",
          "menu",
          "monitor",
          "moon",
          "newspaper",
          "rss",
          "search",
          "sun",
          "x",
        ],
      },
    }),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page)
        return !sitemapExcludedPathPatterns.some((pattern) =>
          pattern.test(pathname)
        )
      },
      i18n: {
        defaultLocale: "en",
        locales: sitemapLocaleMap,
      },
      serialize: (item) => {
        if (!item.links?.length) return item
        const links = new Map(item.links.map((link) => [link.lang, link.url]))
        const defaultUrl = links.get(sitemapLocaleMap.en)
        if (defaultUrl) links.set("x-default", defaultUrl)
        return {
          ...item,
          links: [...links].map(([lang, url]) => ({ lang, url })),
        }
      },
    }),
    mdx(),
    pagefind(),
  ],
})
