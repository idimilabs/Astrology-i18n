import { getCollection, type CollectionEntry } from "astro:content"

import type { Locale } from "@/config/locales"
import { normalizeCategorySlug, normalizeTagSlug } from "@/config/taxonomy"
import { normalizeContentSlug } from "@/utils/content-slug"

export type PostEntry = CollectionEntry<"post">

type ContentDigestEntry = Pick<PostEntry, "id" | "digest">

const publishedPostsPromise = getCollection("post", (entry) => !entry.data.draft)

export function sortPostsByDate(posts: readonly PostEntry[]): PostEntry[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
}

export function contentCacheKey(entries: readonly ContentDigestEntry[]): string {
  return entries.map((entry) => `${entry.id}:${entry.digest}`).join("|")
}

export function postSlug(entry: PostEntry): string {
  return normalizeContentSlug(entry.id, entry.data.locale)
}

export function postPath(entry: PostEntry): string {
  return `/posts/${postSlug(entry)}/`
}

export function postUrl(entry: PostEntry): string {
  return `/${entry.data.locale}${postPath(entry)}`
}

export function postCategorySlug(entry: PostEntry): string {
  return normalizeCategorySlug(entry.data.category)
}

export function postTagSlugs(entry: PostEntry): string[] {
  return [...new Set(entry.data.tags.map((tag) => normalizeTagSlug(tag)))]
}

export async function getPublishedPosts(): Promise<PostEntry[]> {
  return sortPostsByDate(await publishedPostsPromise)
}

export async function getPostsForLocale(locale: Locale): Promise<PostEntry[]> {
  return (await getPublishedPosts()).filter((post) => post.data.locale === locale)
}

export async function getPostsByCategory(locale: Locale, slug: string): Promise<PostEntry[]> {
  return (await getPostsForLocale(locale)).filter((post) => postCategorySlug(post) === slug)
}

export async function getPostsByTag(locale: Locale, slug: string): Promise<PostEntry[]> {
  return (await getPostsForLocale(locale)).filter((post) => postTagSlugs(post).includes(slug))
}
