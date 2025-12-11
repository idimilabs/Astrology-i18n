interface FadeInOptions {
    threshold?: number;
    rootMargin?: string;
    duration?: number;
    delay?: number;
    stagger?: number;
}

class ImageFadeIn {
    private observer: IntersectionObserver | null = null;
    private mutationObserver: MutationObserver | null = null;
    private options: Required<FadeInOptions>;
    private imageCount: number = 0;

    constructor(options: FadeInOptions = {}) {
        this.options = {
            threshold: options.threshold ?? 0.1,
            rootMargin: options.rootMargin ?? '0px 0px -80px 0px',
            duration: options.duration ?? 800,
            delay: options.delay ?? 0,
            stagger: options.stagger ?? 50,
        };

        this.init();
    }

    private init(): void {
        if (!('IntersectionObserver' in window)) {
            console.warn('Intersection Observer not supported');
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.fadeInImage(entry.target as HTMLElement);
                    }
                });
            },
            {
                threshold: this.options.threshold,
                rootMargin: this.options.rootMargin,
            }
        );

        this.observeImages();

        this.observeTextElements();

        this.observeDOMChanges();

        this.setupViewTransitions();
    }

    private observeImages(): void {
        if (!this.observer) return;

        const images = document.querySelectorAll<HTMLElement>(
            'img:not([data-no-fade]):not([data-fade-observed]), picture:not([data-no-fade]):not([data-fade-observed])'
        );

        let firstContentImage: HTMLElement | null = null;

        images.forEach((img) => {
            const isPriority =
                img.getAttribute('fetchpriority') === 'high' ||
                img.getAttribute('loading') === 'eager' ||
                img.hasAttribute('priority');

            const rect = img.getBoundingClientRect();
            const isInViewport = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            if (isInViewport && !firstContentImage && !this.isNavigationImage(img)) {
                firstContentImage = img;
            }

            const shouldExclude =
                isPriority ||
                img === firstContentImage ||
                this.isNavigationImage(img);

            if (shouldExclude) {
                img.setAttribute('data-no-fade', 'true');
                img.setAttribute('data-fade-observed', 'true');
                return;
            }

            img.style.opacity = '0';
            img.style.transform = 'translateY(20px)';
            img.style.transition = `opacity ${this.options.duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${this.options.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            img.style.willChange = 'opacity, transform';
            img.setAttribute('data-fade-observed', 'true');

            img.setAttribute('data-fade-index', String(this.imageCount++));

            this.observer!.observe(img);
        });
    }


    private isNavigationImage(img: HTMLElement): boolean {
        const parent = img.closest('header, nav, footer, [role="navigation"]');
        if (parent) {
            return true;
        }

        const rect = img.getBoundingClientRect();
        if (rect.width < 80 && rect.height < 80) {
            return true;
        }


        const alt = img.getAttribute('alt')?.toLowerCase() || '';
        const className = img.className?.toLowerCase() || '';
        const keywords = ['logo', 'icon', 'badge'];

        if (keywords.some(keyword => alt.includes(keyword) || className.includes(keyword))) {
            return true;
        }

        return false;
    }

    private observeTextElements(): void {
        if (!this.observer) return;
        const textElements = document.querySelectorAll<HTMLElement>(
            'h1:not([data-fade-observed]), h2:not([data-fade-observed]), h3:not([data-fade-observed]), ' +
            'h4:not([data-fade-observed]), h5:not([data-fade-observed]), h6:not([data-fade-observed]), ' +
            'p:not([data-fade-observed]), ' +
            'li:not([data-fade-observed]), ' +
            'ul:not([data-fade-observed]), ol:not([data-fade-observed]), ' +
            'blockquote:not([data-fade-observed]), ' +
            'dd:not([data-fade-observed]), dt:not([data-fade-observed]), ' +
            'table:not([data-fade-observed]), ' +
            'pre:not([data-fade-observed]), ' +
            'article:not([data-fade-observed]), ' +
            'section:not([data-fade-observed]), ' +
            'div.content:not([data-fade-observed]), ' +
            'div.prose:not([data-fade-observed])'
        );

        textElements.forEach((element) => {
            const parent = element.closest('header, nav, footer, [role="navigation"]');
            if (parent) {
                element.setAttribute('data-fade-observed', 'true');
                return;
            }

            const rect = element.getBoundingClientRect();
            const isInViewport = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            if (isInViewport) {
                element.setAttribute('data-fade-observed', 'true');
                return;
            }

            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style.willChange = 'opacity, transform';
            element.setAttribute('data-fade-observed', 'true');
            element.setAttribute('data-fade-index', String(this.imageCount++));

            this.observer!.observe(element);
        });
    }

    private fadeInImage(element: HTMLElement): void {
        if (!this.observer) return;

        const fadeIndex = parseInt(element.getAttribute('data-fade-index') || '0', 10);
        const staggerDelay = fadeIndex * this.options.stagger;
        const totalDelay = this.options.delay + staggerDelay;
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';

            setTimeout(() => {
                this.observer?.unobserve(element);
                element.removeAttribute('data-fade-index');
                element.style.willChange = 'auto';
                element.style.transition = '';
                element.style.transform = '';
            }, this.options.duration);
        }, totalDelay);
    }

    private observeDOMChanges(): void {
        this.mutationObserver = new MutationObserver((mutations) => {
            let hasNewImages = false;

            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as HTMLElement;
                            if (
                                element.tagName === 'IMG' ||
                                element.tagName === 'PICTURE' ||
                                element.querySelector('img, picture')
                            ) {
                                hasNewImages = true;
                            }
                        }
                    });
                }
            });

            if (hasNewImages) {
                requestAnimationFrame(() => {
                    this.observeImages();
                });
            }
        });

        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    private setupViewTransitions(): void {
        document.addEventListener('astro:page-load', () => {
            this.imageCount = 0;
            this.observeImages();
            this.observeTextElements();
        });

        document.addEventListener('astro:before-preparation', () => {
            if (this.observer) {
                this.observer.disconnect();
            }
        });
    }

    public destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
    }
}

if (typeof window !== 'undefined') {
    const initFadeIn = () => {
        new ImageFadeIn({
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px',
            duration: 800,
            delay: 0,
            stagger: 50,
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFadeIn);
    } else {
        initFadeIn();
    }
}

export default ImageFadeIn;
