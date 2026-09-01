import { normalizeCategorySlug, normalizeTagSlug } from "@/config/taxonomy"

type NavigablePost = {
  id: string
  data: {
    locale: string
    category: string
    tags: readonly string[]
    pubDate: Date
  }
}

export function selectRelatedPosts<TPost extends NavigablePost>(posts: readonly TPost[], current: TPost, limit = 3): TPost[] {
  const currentTags = new Set(current.data.tags.map((tag) => normalizeTagSlug(tag)))
  const currentCategory = normalizeCategorySlug(current.data.category)

  return posts
    .filter((post) => post.id !== current.id && post.data.locale === current.data.locale)
    .map((post) => {
      const sharedTagCount = post.data.tags
        .map((tag) => normalizeTagSlug(tag))
        .filter((tag) => currentTags.has(tag)).length
      const categoryScore = normalizeCategorySlug(post.data.category) === currentCategory ? 10 : 0

      return {
        post,
        score: categoryScore + sharedTagCount,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime())
    .slice(0, limit)
    .map((item) => item.post)
}
