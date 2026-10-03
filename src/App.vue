<script setup lang="ts">
import { ref } from 'vue'
import GalaxySection from '@/components/sections/GalaxySection.vue'
import TimelineSection from '@/components/sections/TimelineSection.vue'
import FooterSection from '@/components/sections/FooterSection.vue'

const activeFilter = ref('')
const activeTrack = ref<'builder' | 'analyst'>('builder')
const highlightProject = ref('')

function handleNavigate(payload: { target: 'builder' | 'analyst'; filter: string }) {
  activeTrack.value = payload.target
  activeFilter.value = payload.filter

  // If filter looks like a project slug, highlight it
  if (payload.filter && !['frontend', 'backend', 'database', 'analysis', 'all', 'Vccorp', 'CMC Global', 'Samsung'].includes(payload.filter)) {
    highlightProject.value = payload.filter
  } else {
    highlightProject.value = ''
  }

  // Scroll to the target section
  const targetEl = document.getElementById(payload.target === 'builder' ? 'the-builder' : 'the-analyst')
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <main>
    <GalaxySection @navigate="handleNavigate" />
    <TimelineSection
      :active-filter="activeFilter"
      :active-track="activeTrack"
      :highlight-project="highlightProject"
    />
    <FooterSection />
  </main>
</template>
