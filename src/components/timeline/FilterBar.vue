<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FilterOption } from '@/types'

defineProps<{
  options: FilterOption[]
  active: string
  tone: 'builder' | 'analyst'
}>()

const emit = defineEmits<{ select: [id: string] }>()
const { t } = useI18n()

const activeClass = {
  builder: 'bg-primary-container text-on-primary-container',
  analyst: 'bg-domain-ai text-white'
}
</script>

<template>
  <div class="flex items-center flex-wrap gap-space-xs p-1 bg-content-surface rounded-lg self-start" role="toolbar">
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      :aria-pressed="active === option.id"
      :title="option.hint"
      class="py-1.5 rounded-md text-label-md font-semibold transition-all inline-flex items-center gap-0.5"
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
