/**
 * Global Page Initialization Manager
 *
 * Unified management for Astro View Transitions page initialization logic,
 * ensuring components are correctly initialized during page load and navigation.
 *
 * @example
 * ```typescript
 * import { registerPageInit } from '@/utils/page-init';
 *
 * // Register initialization function
 * registerPageInit('themeSwitcher', () => {
 *   const buttons = document.querySelectorAll('[data-theme]');
 *   // ... initialization logic
 * });
 * ```
 */

type InitFunction = () => void | (() => void);
type CleanupFunction = () => void;

interface InitHandler {
  init: InitFunction;
  cleanup?: CleanupFunction;
}

class PageInitManager {
  private handlers: Map<string, InitHandler> = new Map();
  private cleanupFunctions: Map<string, CleanupFunction> = new Map();
  private initialized = false;

  constructor() {
    this.setup();
  }

  private setup(): void {
    if (typeof window === 'undefined') return;

    // Initialize on first load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.runAllInits());
    } else {
      this.runAllInits();
    }

    // Re-initialize on Astro view transitions
    document.addEventListener('astro:page-load', () => {
      this.runAllInits();
    });

    // Cleanup before page transition
    document.addEventListener('astro:before-preparation', () => {
      this.runAllCleanups();
    });
  }

  /**
   * 注册页面初始化函数
   *
   * @param name - 唯一标识符
   * @param init - 初始化函数，可选返回清理函数
   * @param options - 配置选项
   */
  register(
    name: string,
    init: InitFunction,
    options?: {
      /** Whether to execute immediately (if page is already loaded) */
      immediate?: boolean;
    },
  ): void {
    const cleanup = this.cleanupFunctions.get(name);
    if (cleanup) {
      cleanup();
      this.cleanupFunctions.delete(name);
    }

    this.handlers.set(name, { init });

    // If page is already initialized and immediate execution is set, run now
    if (this.initialized && options?.immediate) {
      this.runInit(name);
    }
  }

  /**
   * 取消注册初始化函数
   *
   * @param name - 要移除的处理器名称
   */
  unregister(name: string): void {
    const cleanup = this.cleanupFunctions.get(name);
    if (cleanup) {
      cleanup();
      this.cleanupFunctions.delete(name);
    }
    this.handlers.delete(name);
  }

  private runInit(name: string): void {
    const handler = this.handlers.get(name);
    if (!handler) return;

    try {
      // Clean up previous instance first (if any)
      const existingCleanup = this.cleanupFunctions.get(name);
      if (existingCleanup) {
        existingCleanup();
        this.cleanupFunctions.delete(name);
      }

      // Execute initialization
      const result = handler.init();

      // If a cleanup function was returned, save it
      if (typeof result === 'function') {
        this.cleanupFunctions.set(name, result);
      }
    } catch (error) {
      console.error(`[PageInit] Error initializing "${name}":`, error);
    }
  }

  private runAllInits(): void {
    this.handlers.forEach((_, name) => {
      this.runInit(name);
    });
    this.initialized = true;
  }

  private runAllCleanups(): void {
    this.cleanupFunctions.forEach((cleanup, name) => {
      try {
        cleanup();
      } catch (error) {
        console.error(`[PageInit] Error cleaning up "${name}":`, error);
      }
    });
    this.cleanupFunctions.clear();
  }

  /**
   * 获取所有已注册的处理器名称
   */
  getRegisteredHandlers(): string[] {
    return Array.from(this.handlers.keys());
  }
}

// Create global singleton
const pageInitManager = new PageInitManager();

/**
 * Register page initialization function
 *
 * This function will be executed at the following times:
 * 1. When the page first loads (DOMContentLoaded)
 * 2. After Astro view transitions (astro:page-load)
 *
 * @param name - Unique identifier for management and debugging
 * @param init - Initialization function, optionally returns a cleanup function
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * // Basic usage
 * registerPageInit('myComponent', () => {
 *   const element = document.querySelector('#my-element');
 *   element?.addEventListener('click', handleClick);
 * });
 *
 * // With cleanup function
 * registerPageInit('myComponent', () => {
 *   const element = document.querySelector('#my-element');
 *   const handler = () => console.log('clicked');
 *   element?.addEventListener('click', handler);
 *
 *   // Return cleanup function
 *   return () => {
 *     element?.removeEventListener('click', handler);
 *   };
 * });
 * ```
 */
export function registerPageInit(
  name: string,
  init: InitFunction,
  options?: { immediate?: boolean },
): void {
  pageInitManager.register(name, init, options);
}

/**
 * 取消注册页面初始化函数
 *
 * @param name - 要移除的处理器名称
 */
export function unregisterPageInit(name: string): void {
  pageInitManager.unregister(name);
}

/**
 * 获取所有已注册的初始化处理器名称
 */
export function getRegisteredInits(): string[] {
  return pageInitManager.getRegisteredHandlers();
}

// Export types for external use
export type { InitFunction, CleanupFunction };
