import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8")
}

test("Public page contracts keep accessibility metadata", async () => {
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
