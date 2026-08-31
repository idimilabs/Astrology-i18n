export type HomepageLayout = "cover" | "archive" | "text"
export type RemoteImagePattern = {
  protocol: "https"
  hostname: string
}
export type X402ChargeMode = "all" | "bot-only"

function readPublicEnv(name: string): string | undefined {
  const importMetaEnv = (
    import.meta as ImportMeta & { env?: Record<string, string | undefined> }
  ).env
  const nodeEnv = (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> }
    }
  ).process?.env

  return importMetaEnv?.[name] ?? nodeEnv?.[name]
}

function normalizeGoogleTagManagerId(value: string | undefined): string {
  const id = (value ?? "").trim()
  return /^GTM-[A-Z0-9]+$/i.test(id) ? id.toUpperCase() : ""
}

function normalizeGoogleAdsenseClientId(value: string | undefined): string {
  const id = (value ?? "").trim()
  return /^ca-pub-\d+$/i.test(id) ? id : ""
}

function normalizePublicString(value: string | undefined): string {
  return (value ?? "").trim()
}

function hostnameFromUrl(value: string): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.hostname : undefined
  } catch {
    return undefined
  }
}

function normalizeX402ChargeMode(value: string | undefined): X402ChargeMode {
  const mode = normalizePublicString(value).toLowerCase()
  return mode === "bot-only" || mode === "bots" ? "bot-only" : "all"
}

function normalizeBotScoreThreshold(value: string | undefined): number {
  const threshold = Number.parseInt(normalizePublicString(value), 10)
  if (!Number.isFinite(threshold)) return 30
  return Math.min(99, Math.max(1, threshold))
}

const googleTagManagerId = normalizeGoogleTagManagerId(
  readPublicEnv("PUBLIC_GTM_ID")
)
const googleAdsenseClientId = normalizeGoogleAdsenseClientId(
  readPublicEnv("PUBLIC_ADSENSE_CLIENT_ID")
)
const publicAssetBaseUrl = normalizePublicString(
  readPublicEnv("PUBLIC_ASSET_BASE_URL")
).replace(/\/$/, "")
const publicAssetHost = hostnameFromUrl(publicAssetBaseUrl)
const x402PayTo = normalizePublicString(readPublicEnv("PUBLIC_X402_PAY_TO"))
const x402Network = normalizePublicString(
  readPublicEnv("PUBLIC_X402_NETWORK") ??
    "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
)
const x402Price = normalizePublicString(
  readPublicEnv("PUBLIC_X402_PRICE") ?? "$0.01"
)
const x402Description = normalizePublicString(
  readPublicEnv("PUBLIC_X402_DESCRIPTION") ??
    "Voluntary x402 payment support for Polyglow content."
)
const x402FacilitatorUrl = normalizePublicString(
  readPublicEnv("PUBLIC_X402_FACILITATOR_URL")
)
const x402ChargeMode = normalizeX402ChargeMode(
  readPublicEnv("PUBLIC_X402_CHARGE_MODE")
)
const x402BotScoreThreshold = normalizeBotScoreThreshold(
  readPublicEnv("PUBLIC_X402_BOT_SCORE_THRESHOLD")
)
const socialXUrl = "https://x.com/zbzailabs"
const socialXHandle = `@${
  new URL(socialXUrl).pathname.split("/").filter(Boolean)[0] ?? "polyglow"
}`

export const SITE_CONFIG = {
  name: "Polyglow",
  url: (
    readPublicEnv("PUBLIC_SITE_URL") ?? "https://polyglow.zbz.ai"
  ).replace(/\/$/, ""),
  description:
    "Pressing forward through the waves of startup, the fog of investing, and the ocean of life.",
  repository: "https://github.com/zbzailabs/Polyglow",
  social: {
    x: socialXUrl,
    xHandle: socialXHandle,
  },
  logo: "/favicon.svg",
  defaultOgImage: "/open-graph.webp",
  assets: {
    publicBaseUrl: publicAssetBaseUrl,
    remotePatterns: [
      ...(publicAssetHost
        ? [{ protocol: "https", hostname: publicAssetHost } as const]
        : []),
      { protocol: "https", hostname: "*.unsplash.com" },
    ] satisfies RemoteImagePattern[],
    unsplashImageHost: "images.unsplash.com",
  },
  homepage: {
    layout: "cover" as HomepageLayout,
  },
  analytics: {
    googleTagManager: {
      enabled: readPublicEnv("PUBLIC_GTM_ENABLED") === "true",
      containerId: googleTagManagerId,
    },
    googleAdsense: {
      enabled: readPublicEnv("PUBLIC_ADSENSE_ENABLED") === "true",
      clientId: googleAdsenseClientId,
    },
  },
  payments: {
    x402: {
      enabled: readPublicEnv("PUBLIC_X402_ENABLED") === "true",
      payTo: x402PayTo,
      network: x402Network,
      price: x402Price,
      description: x402Description,
      facilitatorUrl: x402FacilitatorUrl,
      chargeMode: x402ChargeMode,
      botScoreThreshold: x402BotScoreThreshold,
    },
  },
}
