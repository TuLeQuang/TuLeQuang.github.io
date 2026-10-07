<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFocus } from '@/composables/useFocus'
import { scrollToSection, TRACK_SECTION } from '@/utils/sections'
import { focusLabel } from '@/composables/useCv'

/**
 * Mobile replacement for the header breadcrumb + "Clear highlight" pill: a chip floating above the
 * bottom nav. Tap the label to jump to the related track, tap ✕ (or swipe sideways) to clear.
 */
const { t } = useI18n()
const { focus, clear } = useFocus()
const label = computed(() => focusLabel(focus.value))

let startX: number | null = null
const onTouchStart = (event: TouchEvent): void => {
  startX = event.touches[0]?.clientX ?? null
}
const onTouchEnd = (event: TouchEvent): void => {
  const endX = event.changedTouches[0]?.clientX
  if (startX !== null && endX !== undefined && Math.abs(endX - startX) > 60) clear()
  startX = null
}
const goToTrack = (): void => {
  if (focus.value) scrollToSection(TRACK_SECTION[focus.value.track])
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="focus"
      class="md:hidden fixed left-1/2 -translate-x-1/2 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 max-w-[calc(100vw-8.5rem)] inline-flex items-center rounded-full bg-primary-container/95 text-on-primary-container shadow-lg backdrop-blur-md"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
    >
      <button type="button" class="min-h-11 pl-space-md pr-space-xs inline-flex items-center gap-1 text-label-md font-semibold min-w-0" @click="goToTrack">
        <span class="material-symbols-outlined text-[16px]" aria-hidden="true">auto_awesome</span>
        <span class="truncate">{{ label }}</span>
      </button>
      <button
        type="button"
        class="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        :aria-label="t('nav.clearHighlight', { label })"
        @click="clear"
      >
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  </Transition>
</template>
