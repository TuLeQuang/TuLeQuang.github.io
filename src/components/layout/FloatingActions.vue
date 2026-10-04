<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFocus } from '@/composables/useFocus'

/**
 * Floating actions, bottom-right:
 *  - "Clear highlight" pill while a focus is active (also Esc), so it can be removed from anywhere on the page
 *  - small, faded "back to top" button once the user has scrolled down
 */
const { t } = useI18n()
const { focus, clear } = useFocus()
const scrolled = ref(false)

const focusLabel = computed(() => (focus.value ? t(focus.value.labelKey) : ''))

const onScroll = (): void => {
  // Mobile: only after ~2 screens, so it does not compete with the bottom nav
  const threshold = window.innerWidth < 768 ? window.innerHeight * 2 : 600
  scrolled.value = window.scrollY > threshold
}
const onKey = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && focus.value) clear()
}
const toTop = (): void => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})

const fade = {
  enterActiveClass: 'transition duration-200 ease-out',
  enterFromClass: 'opacity-0 translate-y-2',
  leaveActiveClass: 'transition duration-150 ease-in',
  leaveToClass: 'opacity-0 translate-y-2'
}
</script>

<template>
  <div
    class="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-space-sm pointer-events-none"
  >
    <Transition v-bind="fade">
      <button
        v-if="focus"
        type="button"
        class="pointer-events-auto hidden md:inline-flex items-center gap-1 max-w-[calc(100vw-2rem)] pl-space-sm pr-space-md py-1.5 rounded-full bg-primary-container/90 text-on-primary-container text-label-md font-semibold shadow-lg backdrop-blur-md hover:bg-primary-blue-dark transition-colors"
        :aria-label="t('nav.clearHighlight', { label: focusLabel })"
        @click="clear"
      >
        <span class="material-symbols-outlined text-[16px]">close</span>
        <span class="truncate">{{ t('nav.clearHighlight', { label: focusLabel }) }}</span>
      </button>
    </Transition>

    <Transition v-bind="fade">
      <button
        v-if="scrolled"
        type="button"
        class="pointer-events-auto w-11 h-11 md:w-9 md:h-9 rounded-full bg-surface-container-high/60 text-on-surface-variant shadow-md backdrop-blur-md flex items-center justify-center opacity-70 md:opacity-50 hover:opacity-100 hover:text-on-surface transition-opacity"
        :aria-label="t('nav.backToTop')"
        :title="t('nav.backToTop')"
        @click="toTop"
      >
        <span class="material-symbols-outlined text-[18px]">arrow_upward</span>
      </button>
    </Transition>
  </div>
</template>
