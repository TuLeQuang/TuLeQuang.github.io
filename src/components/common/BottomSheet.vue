<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Mobile bottom sheet: slides up from the bottom, closes on backdrop tap, ✕, Esc,
 * drag-down on the handle, or the Android Back button (one history entry per open sheet).
 */
const props = withDefaults(defineProps<{ open: boolean; label: string; full?: boolean }>(), { full: false })
const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()

const dragY = ref(0)
let startY: number | null = null
let pushedHistory = false

const onKey = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') emit('close')
}
const onPop = (): void => {
  pushedHistory = false
  emit('close')
}

const attach = (): void => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
  // Popping our history entry must not make the browser jump to an old scroll position
  history.scrollRestoration = 'manual'
  history.pushState({ sheet: true }, '')
  pushedHistory = true
  window.addEventListener('popstate', onPop)
}
const detach = (): void => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('popstate', onPop)
  if (pushedHistory) {
    pushedHistory = false
    history.back()
  }
  setTimeout(() => (history.scrollRestoration = 'auto'), 400)
  dragY.value = 0
}

watch(
  () => props.open,
  open => (open ? attach() : detach())
)
onBeforeUnmount(() => {
  if (props.open) detach()
})

const onDragStart = (event: PointerEvent): void => {
  startY = event.clientY
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}
const onDragMove = (event: PointerEvent): void => {
  if (startY !== null) dragY.value = Math.max(0, event.clientY - startY)
}
const onDragEnd = (): void => {
  if (dragY.value > 100) emit('close')
  dragY.value = 0
  startY = null
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs" aria-hidden="true" @click="emit('close')" />
    </Transition>
    <Transition
      enter-active-class="transition-transform duration-300 ease-out motion-reduce:transition-none"
      enter-from-class="translate-y-full"
      leave-active-class="transition-transform duration-200 ease-in motion-reduce:transition-none"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="open"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        class="fixed inset-x-0 bottom-0 z-[61] flex flex-col rounded-t-2xl bg-content-bg text-text-primary shadow-2xl pb-[env(safe-area-inset-bottom)]"
        :class="full ? 'h-[92dvh]' : 'max-h-[85dvh]'"
        :style="dragY ? { transform: `translateY(${dragY}px)` } : undefined"
      >
        <div
          class="relative shrink-0 flex items-center justify-center h-11 touch-none cursor-grab"
          :title="t('sheet.dragHint')"
          @pointerdown="onDragStart"
          @pointermove="onDragMove"
          @pointerup="onDragEnd"
          @pointercancel="onDragEnd"
        >
          <span class="w-10 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
          <button
            type="button"
            class="absolute right-2 top-1 w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-content-surface"
            :aria-label="t('sheet.close')"
            @pointerdown.stop
            @click="emit('close')"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto overscroll-contain px-gutter-mobile pb-space-lg">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
