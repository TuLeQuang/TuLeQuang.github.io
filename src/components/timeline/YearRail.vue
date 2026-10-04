<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AwardBadge from '@/components/common/AwardBadge.vue'
import HScroll from '@/components/common/HScroll.vue'
import { useFocus } from '@/composables/useFocus'
import { milestoneMatchesFocus } from '@/utils/focusMatch'
import type { ProjectTrack, TimelineMilestone } from '@/types'

/**
 * Mobile timeline: a horizontal rail of years (newest first). Tapping a year shows that
 * milestone's title + description below. Desktop keeps the vertical TimelineTrack.
 */
const props = defineProps<{
  milestones: TimelineMilestone[]
  title: string
  icon: string
  tone: ProjectTrack
}>()

const { t } = useI18n()
const { focus } = useFocus()

const rows = computed(() => [...props.milestones].reverse())
const selectedId = ref(rows.value[0]?.id ?? '')
const selected = computed(() => rows.value.find(m => m.id === selectedId.value) ?? rows.value[0])

/** Milestones related to the current focus get a ring, like the desktop timeline. */
const isMatch = (m: TimelineMilestone): boolean => (focus.value ? milestoneMatchesFocus(m, focus.value) : false)

const tones = computed(() =>
  props.tone === 'analyst'
    ? { icon: 'text-domain-ai', active: 'bg-domain-ai text-white', ring: 'ring-domain-ai' }
    : { icon: 'text-primary-container', active: 'bg-primary-container text-on-primary-container', ring: 'ring-primary-container' }
)
</script>

<template>
  <div v-reveal class="bg-content-surface rounded-xl shadow-xs p-space-md flex flex-col gap-space-sm">
    <div class="flex items-center gap-space-xs text-headline-sm text-text-primary">
      <span class="material-symbols-outlined text-[20px]" :class="tones.icon" aria-hidden="true">{{ icon }}</span>
      <span>{{ title }}</span>
    </div>

    <HScroll>
      <button
        v-for="milestone in rows"
        :key="milestone.id"
        type="button"
        class="shrink-0 snap-start min-h-11 px-space-md rounded-full text-label-md font-semibold whitespace-nowrap transition-all"
        :class="[
          milestone.id === selected?.id ? tones.active : 'bg-content-bg text-text-secondary',
          isMatch(milestone) ? ['ring-2', tones.ring] : ''
        ]"
        :aria-pressed="milestone.id === selected?.id"
        @click="selectedId = milestone.id"
      >
        {{ milestone.year }}<span v-if="milestone.achievementId" aria-hidden="true"> 🏆</span>
      </button>
    </HScroll>

    <Transition
      mode="out-in"
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="selected" :key="selected.id" class="bg-content-bg rounded-lg p-space-sm" aria-live="polite">
        <div class="text-headline-sm text-text-primary flex flex-wrap items-center gap-1">
          <span>{{ t(`milestones.${selected.id}.title`) }}</span>
          <AwardBadge v-if="selected.achievementId" :achievement-id="selected.achievementId" />
        </div>
        <p class="text-body-md text-text-secondary mt-1">{{ t(`milestones.${selected.id}.desc`) }}</p>
      </div>
    </Transition>
  </div>
</template>
