import rss from "@astrojs/rss"

import { SITE_CONFIG } from "@/config/site"
import { LOCALES, getLocaleMeta, type Locale } from "@/config/locales"
import { contentCacheKey, getPostsForLocale, postUrl } from "@/utils/posts"

export async function getStaticPaths() {
  return Promise.all(
    LOCALES.map(async (lang) => {
      const posts = await getPostsForLocale(lang)
      return { params: { lang }, cacheKey: contentCacheKey(posts) }
    })
  )
}

export async function GET(context: { params: { lang?: string } }) {
  const lang = context.params.lang as Locale
  const posts = await getPostsForLocale(lang)
  const localeMeta = getLocaleMeta(lang)

  return rss({
    title: `${SITE_CONFIG.name} ${localeMeta.label}`,
    description: SITE_CONFIG.description,
    site: SITE_CONFIG.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  })
}
