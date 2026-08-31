import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8")
}

test("Preserve redesign keeps the approved monochrome palette", async () => {
  const [styles, design, ogImage, logo, favicon] = await Promise.all([
    readProjectFile("src/styles/global.css"),
    readProjectFile("DESIGN.md"),
    readProjectFile("public/open-graph.svg"),
    readProjectFile("src/assets/logo.svg"),
    readProjectFile("public/favicon.svg"),
  ])

  assert.match(styles, /--primary:\s*oklch\(0\.205 0 0\)/)
  assert.match(styles, /--background:\s*oklch\(1 0 0\)/)
  assert.match(styles, /--card:\s*oklch\(1 0 0\)/)
  assert.match(styles, /--ring:\s*oklch\(0\.556 0 0\)/)
  assert.doesNotMatch(styles, /006EDB|5AA9FF/i)
  for (const theme of [/:root\s*{([\s\S]*?)\n}/, /\.dark\s*{([\s\S]*?)\n}/]) {
    const block = styles.match(theme)?.[1] ?? ""
    for (const match of block.matchAll(/--([\w-]+):\s*oklch\([\d.]+\s+([\d.]+)/g)) {
      if (match[1] !== "destructive") assert.equal(Number(match[2]), 0)
    }
  }
  assert.match(design, /primary: "#171717"/)
  assert.doesNotMatch(design, /006EDB|5AA9FF/i)
  assert.match(ogImage, />Polyglow<\/text>/)
  assert.doesNotMatch(ogImage, /PolyGlow/)
  for (const match of ogImage.matchAll(/#([0-9a-f]{6})/gi)) {
    const [, hex] = match
    assert.equal(hex.slice(0, 2), hex.slice(2, 4))
    assert.equal(hex.slice(2, 4), hex.slice(4, 6))
  }
  assert.match(logo, /fill: #000/)
  assert.match(favicon, /fill: #000/)
  assert.match(favicon, /prefers-color-scheme: dark/)
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
