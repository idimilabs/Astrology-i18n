/// <reference types="astro/client" />

interface Window {
  adsbygoogle?: unknown[]
  PagefindUI?: new (options: {
    element: string
    bundlePath: string
    showImages: boolean
    showSubResults: boolean
  }) => { destroy?: () => void }
  __dropdownMenuCleanup?: () => void
  __mobileNavCleanup?: () => void
  __themeSwitcherCleanup?: () => void
  __pagefindSearch?: {
    id: string
    instance: { destroy?: () => void }
    locale: string
  }
  __pagefindSearchCleanup?: () => void
  __pagefindSearchObserver?: MutationObserver
  __dynamicGlassCleanup?: () => void
  __authorActivityCleanup?: () => void
}
