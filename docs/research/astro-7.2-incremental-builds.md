# Astro 7.2 incremental static builds 调研

调研日期：2026-08-07

## 结论

`experimental.incrementalBuild` 适合 Polyglow 的内容详情页和内容列表页，但不能只开启配置。每个希望复用的动态静态路径都必须由 `getStaticPaths()` 返回 `cacheKey`；它必须随该路径 HTML 所依赖的**数据**变化而变化。Astro 自行比较页面完整模块图（页面、布局、组件、导入的资源和包）的哈希；模块图和 `cacheKey` 都相同才跳过渲染。没有键的路径保持完整渲染。[Astro 7.2 发布说明](https://astro.build/blog/astro-720/)；[7.2.0 公共类型](https://github.com/withastro/astro/blob/astro%407.2.0/packages/astro/src/types/public/common.ts#L13-L20)

它仍是实验功能。缓存存放在 `cacheDir`（本项目默认 `node_modules/.astro/`），其中包含清单和可恢复的 HTML；`dist` 被清空后，跳过的页面从此处恢复。因此持续部署要保留该目录才会得到跨构建收益。配置或 lockfile 变化会使整个缓存失效，`astro build --force` 也会强制完整渲染并写出新缓存。[Astro 7.2 发布说明](https://astro.build/blog/astro-720/)；[增量缓存实现](https://github.com/withastro/astro/blob/astro%407.2.0/packages/astro/src/core/build/incremental.ts#L41-L145)

## Polyglow 路由建议

| 优先级 | 路径文件 | `cacheKey` 应覆盖的数据 |
| --- | --- | --- |
| 必须 | `src/pages/[lang]/posts/[...slug].astro` | 当前文章的 `digest`，同 slug 的各语言文章（`alternates`），以及同语言、同分类或有共同 tag 的文章（`relatedPosts`）。只用当前文章的 `digest` 会遗漏相关推荐或语言替代项变化。 |
| 必须 | `src/pages/[lang]/index.astro`、`src/pages/[lang]/posts/index.astro`、`src/pages/[lang]/[page].astro`、`src/pages/[lang]/posts/[page].astro` | 本语言已发布文章的顺序、条目 `digest` 和总数。首页与归档均显示列表和分页；分页页还依赖当前切片、总页数与导航。 |
| 必须 | `src/pages/[lang]/category/**`、`src/pages/[lang]/tags/**` | 该语言中影响本分类或 tag 页面文章的顺序、`digest` 和总数；分类/tag 总览及其分页页还需覆盖本语言全部文章，因为它们展示各术语计数。分类定义、译名等代码数据由 Astro 的模块图自动失效。 |
| 必须 | `src/pages/[lang]/rss.xml.ts` | 本语言 RSS 所列全部文章的顺序与 `digest`。 |
| 建议 | `src/pages/[lang]/about.astro`、`author.astro`、`contact.astro`、`privacy-policy.astro`、`terms-of-service.astro` | 相应 page/author 条目的 `digest`；`about` 和 `author` 还需覆盖它们显示的文章集合。内容渲染本身有内容哈希追踪，但仍要有键才允许跳过。 |
| 不做 | `src/pages/[lang]/search.astro`、`src/pages/[lang]/404.astro` | 仅依赖语言和导入模块，收益很小；保留完整渲染，避免为 11 个轻页增加键维护。 |
| 不可做 | `src/pages/index.astro`、`src/pages/404.astro`、`src/pages/rss.xml.ts`、`src/pages/robots.txt.ts`、`src/pages/llms*.ts` | 这些不是由 `getStaticPaths()` 生成的动态路径，7.2 的 `cacheKey` API 无处可填。 |

实现时应在现有 `getStaticPaths()` 处生成键，复用 `CollectionEntry.digest`，不要引入第三方缓存或单独的页面缓存。聚合键必须同时包含会改变输出的条目及顺序/计数；仅用 `lang`、URL 或当前分页号会在新增、删除、重排文章后错误复用旧 HTML。官方示例明确推荐内容条目使用 `entry.digest`。[Astro 7.2 发布说明](https://astro.build/blog/astro-720/)

## 启用前提与限制

- 在当前 `astro.config.mjs` 的既有 `experimental` 对象加入 `incrementalBuild: true` 即可；该选项默认 `false`，类型为布尔值。[7.2.0 配置类型](https://github.com/withastro/astro/blob/astro%407.2.0/packages/astro/src/types/public/config.ts#L3352-L3391)
- `build.concurrency > 1` 会让 Astro 禁用增量缓存并报警告；当前项目未设置该项，Astro 7.2 默认值为 `1`，可用，但以后不要为了并发构建把它调高。[默认配置](https://github.com/withastro/astro/blob/astro%407.2.0/packages/astro/src/core/config/schemas/defaults.ts#L12-L21)；[生成阶段实现](https://github.com/withastro/astro/blob/astro%407.2.0/packages/astro/src/core/build/generate.ts#L108-L137)
- 服务器岛屿页面只有在加密密钥不变时才可复用；Polyglow 当前静态输出未使用服务器岛屿，故不构成现有阻碍。[增量缓存实现](https://github.com/withastro/astro/blob/astro%407.2.0/packages/astro/src/core/build/incremental.ts#L60-L66)
- 若未来 middleware 改写预渲染 HTML，Astro 不会将 middleware 改动纳入页面模块图；该改动后的首次发布须使用 `astro build --force`。这是官方记录的实验功能限制。[Astro incremental builds 文档](https://docs.astro.build/en/reference/experimental-flags/incremental-build/)
