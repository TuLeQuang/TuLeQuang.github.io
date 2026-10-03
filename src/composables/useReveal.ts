import type { Directive } from 'vue'

/**
 * v-reveal — fade-up when the element enters the viewport.
 * Optional value = delay in ms (for staggering), e.g. v-reveal="index * 80".
 * One shared IntersectionObserver; elements are unobserved after revealing,
 * so elements mounted later (v-if, filters) are handled too.
 */
let observer: IntersectionObserver | null = null

const getObserver = (): IntersectionObserver => {
  observer ??= new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        el.classList.remove('reveal-init')
        el.classList.add('reveal-in')
        observer?.unobserve(el)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  return observer
}

export const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined') return
    if (binding.value) el.style.animationDelay = `${binding.value}ms`
    el.classList.add('reveal-init')
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  }
}

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: typeof reveal
  }
}
