import { getCollection, type CollectionEntry } from "astro:content"

import { LOCALES, type Locale } from "@/config/locales"
import { normalizeContentSlug } from "@/utils/content-slug"
import { contentCacheKey } from "@/utils/posts"

export async function getPage(locale: Locale, slug: string): Promise<CollectionEntry<"page"> | undefined> {
  return (await getCollection("page", (entry) => !entry.data.draft)).find((page) => page.data.locale === locale && normalizeContentSlug(page.id, page.data.locale) === slug)
}

export async function getPageStaticPaths(slug: string) {
  return Promise.all(
    LOCALES.map(async (lang) => {
      const page = await getPage(lang, slug)
      return {
        params: { lang },
        props: { lang },
        cacheKey: contentCacheKey(page ? [page] : []),
      }
    })
  )
}

export async function getAuthor(locale: Locale, slug = "default"): Promise<CollectionEntry<"author"> | undefined> {
  return (await getCollection("author", (entry) => !entry.data.draft)).find((author) => author.data.locale === locale && author.data.slug === slug)
}
