<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TechChip from '@/components/common/TechChip.vue'
import type { DeliverableCode } from '@/types'

const props = defineProps<{
  slug: string
  open: boolean
  tone: 'builder' | 'analyst'
  deliverables?: DeliverableCode[]
  /** Deliverables glow while the Analysis node is focused */
  matched?: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()
const { t, tm, rt } = useI18n()

const responsibilities = computed(() =>
  (tm(`projects.${props.slug}.responsibilities`) as unknown[]).map(item => rt(item as Parameters<typeof rt>[0]))
)
const panelId = computed(() => `drawer-${props.slug}-${props.tone}`)
const accent = computed(() => (props.tone === 'analyst' ? 'text-domain-ai' : 'text-primary-container'))
</script>

<template>
  <div class="mt-space-md pt-space-md">
    <button
      type="button"
      class="w-full text-label-md font-semibold flex items-center justify-between"
      :class="accent"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click.stop="emit('toggle')"
    >
      <span>{{ open ? t('card.hideDetails') : t('card.viewDetails') }}</span>
      <span class="material-symbols-outlined text-[18px] transition-transform duration-300" :class="{ 'rotate-180': open }">
        expand_more
      </span>
    </button>

    <!-- grid-rows 0fr → 1fr gives a smooth height animation without measuring -->
    <div
      :id="panelId"
      class="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
      :class="open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    >
      <div class="overflow-hidden">
        <div class="pt-space-sm flex flex-col gap-space-sm text-text-secondary text-body-md">
          <div>
            <span class="text-label-sm text-text-muted uppercase tracking-wider block mb-1">{{ t('card.responsibilities') }}</span>
            <ul class="flex flex-col gap-1">
              <li v-for="(item, index) in responsibilities" :key="index">• {{ item }}</li>
            </ul>
          </div>
          <div v-if="deliverables?.length">
            <span class="text-label-sm text-text-muted uppercase tracking-wider block mb-1">{{ t('card.deliverables') }}</span>
            <div class="flex flex-wrap gap-space-xs">
              <TechChip
                v-for="code in deliverables"
                :key="code"
                :label="`✓ ${t(`deliverables.${code}`)}`"
                tone="deliverable"
                :matched="matched"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
