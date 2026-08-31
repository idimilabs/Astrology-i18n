import { getLocaleMeta, type Locale } from "@/config/locales"
import { SITE_CONFIG } from "@/config/site"
import { canonicalUrl } from "@/utils/routes"
import { t } from "@/utils/translations"

export type SeoAuthor = {
  name: string
  url: string
}

function absoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_CONFIG.url}${value.startsWith("/") ? "" : "/"}${value}`
}

export function webSiteJsonLd(lang: Locale) {
  const url = canonicalUrl(lang, "/")
  const language = getLocaleMeta(lang).hreflang

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    name: SITE_CONFIG.name,
    url,
    description: t(lang, "site.description"),
    inLanguage: language,
    potentialAction: {
      "@type": "SearchAction",
      target: `${canonicalUrl(lang, "/search/")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function webPageJsonLd(input: {
  lang: Locale
  path: string
  title: string
  description: string
  image?: string
}) {
  const url = canonicalUrl(input.lang, input.path)
  const language = getLocaleMeta(input.lang).hreflang

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: input.title,
    description: input.description,
    url,
    inLanguage: language,
    image: input.image
      ? absoluteUrl(input.image)
      : absoluteUrl(SITE_CONFIG.defaultOgImage),
    isPartOf: {
      "@id": `${canonicalUrl(input.lang, "/")}#website`,
    },
  }
}

export function articleJsonLd(input: {
  lang: Locale
  path: string
  title: string
  description: string
  image: string
  pubDate: Date
  updatedDate?: Date
  authors: SeoAuthor[]
  articleSection: string
  keywords: string[]
  wordCount: number
}) {
  const url = canonicalUrl(input.lang, input.path)
  const image = absoluteUrl(input.image)
  const language = getLocaleMeta(input.lang).hreflang

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: input.title,
    description: input.description,
    inLanguage: language,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: [image],
    thumbnailUrl: image,
    articleSection: input.articleSection,
    keywords: input.keywords,
    wordCount: input.wordCount,
    datePublished: input.pubDate.toISOString(),
    dateModified: (input.updatedDate ?? input.pubDate).toISOString(),
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(SITE_CONFIG.logo),
      },
    },
    author: input.authors.map((author) => ({
      "@type": "Person",
      name: author.name,
      url: author.url,
    })),
  }
}
