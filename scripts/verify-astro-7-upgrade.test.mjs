import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8")
}

function majorRange(value) {
  return Number(value.match(/\d+/)?.[0] ?? Number.NaN)
}

test("Astro 7 dependency contract is active", async () => {
  const packageJson = JSON.parse(await readProjectFile("package.json"))

  assert.equal(
    majorRange(packageJson.dependencies.astro),
    7,
    "astro dependency must target Astro 7"
  )
  assert.match(
    packageJson.dependencies.astro,
    /7\.2\./,
    "astro dependency must target Astro 7.2"
  )
  assert.equal(
    majorRange(packageJson.dependencies["@astrojs/mdx"]),
    7,
    "@astrojs/mdx must match Astro 7"
  )
  assert.equal(
    packageJson.dependencies["@astrojs/markdown-satteri"],
    "^0.3.4",
    "Satteri package must use the Astro 7 compatible release"
  )
  assert.equal(
    majorRange(packageJson.devDependencies.typescript),
    6,
    "Astro check does not support TypeScript 7 yet"
  )
  assert.equal(
    packageJson.devDependencies["@astrojs/compiler-rs"],
    undefined,
    "Astro 7 ships the Rust compiler by default"
  )
})

test("Astro 7 stable features are configured without removed flags", async () => {
  const astroConfig = await readProjectFile("astro.config.mjs")
  const contentConfig = await readProjectFile("src/content.config.ts")

  assert.doesNotMatch(astroConfig, /rustCompiler/)
  assert.doesNotMatch(astroConfig, /queuedRendering/)
  assert.match(
    astroConfig,
    /compressHTML:\s*true/,
    "keep Astro 6 whitespace behavior unless templates are audited for JSX spacing"
  )
  assert.doesNotMatch(
    astroConfig,
    /collectionStorage/,
    "Astro 7.1 collection storage remains experimental"
  )
  assert.equal(
    contentConfig.match(/deferRender:\s*true/g)?.length,
    3,
    "defer rendering for all Markdown content collections"
  )
})

test("Astro 7 background development workflow is exposed", async () => {
  const packageJson = JSON.parse(await readProjectFile("package.json"))

  assert.equal(packageJson.scripts["dev:background"], "astro dev --background")
  assert.equal(packageJson.scripts["dev:parallel"], "astro dev --ignore-lock")
  assert.equal(packageJson.scripts["dev:status"], "astro dev status")
  assert.equal(packageJson.scripts["dev:logs"], "astro dev logs")
  assert.equal(packageJson.scripts["dev:stop"], "astro dev stop")
  assert.equal(packageJson.scripts["dev:json"], "astro dev --json")
})
