import { readonly, ref } from 'vue'

/** Mobile = below Tailwind `md` (768px). Matches the `md:` variants used in templates. */
const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const canMatch = typeof window !== 'undefined' && typeof window.matchMedia === 'function'

// Module-level state: one listener shared by every component.
const isMobile = ref(canMatch ? window.matchMedia(MOBILE_QUERY).matches : false)
const reducedMotion = ref(canMatch ? window.matchMedia(REDUCED_MOTION_QUERY).matches : false)

if (canMatch) {
  window.matchMedia(MOBILE_QUERY).addEventListener('change', e => {
    isMobile.value = e.matches
  })
  window.matchMedia(REDUCED_MOTION_QUERY).addEventListener('change', e => {
    reducedMotion.value = e.matches
  })
}

/** Viewport helpers for layouts that differ structurally between mobile and desktop. */
export function useBreakpoint() {
  return { isMobile: readonly(isMobile), reducedMotion: readonly(reducedMotion) }
}
