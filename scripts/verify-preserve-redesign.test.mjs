import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8")
}

test("Preserve redesign keeps the approved brand palette", async () => {
  const [styles, design, ogImage] = await Promise.all([
    readProjectFile("src/styles/global.css"),
    readProjectFile("DESIGN.md"),
    readProjectFile("public/open-graph.svg"),
  ])

  assert.match(styles, /--primary:\s*oklch\(0\.5505 0\.1868 255\.82\)/)
  assert.match(styles, /--background:\s*oklch\(0\.9743 0\.0068 247\.89\)/)
  assert.match(styles, /--card:\s*oklch\(1 0 0\)/)
  assert.match(design, /primary: "#006EDB"/)
  assert.match(ogImage, />Polyglow<\/text>/)
  assert.doesNotMatch(ogImage, /PolyGlow/)
  assert.doesNotMatch(ogImage, /purple|violet/i)
})

test("Preserve redesign keeps public contracts while adding accessibility", async () => {
  const [layout, pageHeader, pagefind, notFound, structuredData, siteConfig] =
    await Promise.all([
      readProjectFile("src/layouts/main.astro"),
      readProjectFile("src/components/layout/PageHeader.astro"),
      readProjectFile("src/components/features/PagefindSearch.astro"),
      readProjectFile("src/components/ui/NotFoundContent.astro"),
      readProjectFile("src/utils/structured-data.ts"),
      readProjectFile("src/config/site.ts"),
    ])

  assert.match(layout, /href="#main"/)
  assert.match(layout, /<main id="main"[^>]*tabindex="-1"/)
  assert.match(layout, /astro:before-swap/)
  assert.match(pageHeader, /data-page-subtitle/)
  assert.doesNotMatch(pageHeader, /subtitle\s*&&\s*\(\s*<h2/)
  assert.match(pagefind, /role="status"/)
  assert.match(pagefind, /aria-labelledby/)
  assert.match(notFound, /name="q"/)
  assert.match(notFound, /aria-labelledby="not-found-search-prompt"/)
  assert.match(structuredData, /description:\s*t\(lang, "site\.description"\)/)
  assert.match(structuredData, /SITE_CONFIG\.logo/)
  assert.match(siteConfig, /defaultOgImage:\s*"\/open-graph\.webp"/)
})

test("Placeholder posts remain on public discovery surfaces", async () => {
  const [home, article, pagefindIntegration] = await Promise.all([
    readProjectFile("src/pages/[lang]/index.astro"),
    readProjectFile("src/pages/[lang]/posts/[...slug].astro"),
    readProjectFile("src/integrations/pagefind.ts"),
  ])

  assert.match(home, /const posts = await getPostsForLocale\(lang\)/)
  assert.match(home, /image={SITE_CONFIG\.defaultOgImage}/)
  assert.match(
    article,
    /selectRelatedPosts\(localePosts, post, 3\)/,
    "related posts must keep the full published set"
  )
  assert.match(pagefindIntegration, /posts\\\//)
})
