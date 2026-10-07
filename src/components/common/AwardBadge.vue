<script setup lang="ts">
import { computed } from 'vue'
import { resumeData } from '@/data/resume'
import { useCv } from '@/composables/useCv'

const props = defineProps<{
  achievementId: string
  /** Glow animation when the achievement is focused */
  pulse?: boolean
}>()

const cv = useCv()
const icon = computed(() => resumeData.achievements.find(a => a.id === props.achievementId)?.icon ?? '🏆')
</script>

<template>
  <span
    class="px-space-sm py-0.5 rounded-full bg-gold-light text-domain-warehouse-text text-label-sm font-bold whitespace-nowrap"
    :class="{ 'animate-pulse-glow': pulse }"
  >
    {{ icon }} {{ cv.achievements[achievementId] }}
  </span>
</template>
