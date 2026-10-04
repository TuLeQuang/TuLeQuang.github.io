<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FilterOption } from '@/types'

const props = defineProps<{
  options: FilterOption[]
  active: string
  tone: 'builder' | 'analyst'
}>()

const emit = defineEmits<{ select: [id: string] }>()
const { t } = useI18n()
const bar = ref<HTMLElement | null>(null)

const activeClass = {
  builder: 'bg-primary-container text-on-primary-container',
  analyst: 'bg-domain-ai text-white'
}

/** Mobile scroll row: bring the active chip into view horizontally only (no page jump). */
watch(
  () => props.active,
  async id => {
    await nextTick()
    const row = bar.value
    const chip = row?.querySelector<HTMLElement>(`[data-id="${id}"]`)
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' })
  }
)
</script>

<template>
  <div
    ref="bar"
    class="relative flex items-center gap-space-xs p-1 bg-content-surface rounded-lg self-start max-md:max-w-full max-md:flex-nowrap max-md:overflow-x-auto max-md:no-scrollbar max-md:mask-fade-x md:flex-wrap"
    role="toolbar"
  >
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      :data-id="option.id"
      :aria-pressed="active === option.id"
      :title="option.hint"
      class="py-1.5 rounded-md text-label-md font-semibold transition-all inline-flex items-center gap-0.5 max-md:shrink-0 max-md:whitespace-nowrap max-md:min-h-11"
      :class="[
        active === option.id ? activeClass[tone] : 'hover:bg-slate-200 text-text-secondary',
        option.parentId ? '-ml-1 pl-space-sm pr-space-md' : 'px-space-md'
      ]"
      @click="emit('select', option.id)"
    >
      <!-- key client of the employer on its left (e.g. CMC Global ↳ Samsung) -->
      <span v-if="option.parentId" class="material-symbols-outlined text-[14px] opacity-70" aria-hidden="true">
        subdirectory_arrow_right
      </span>
      {{ option.id === 'all' ? t('filters.all', { n: option.count }) : `${option.label} (${option.count})` }}
    </button>
  </div>
</template>
