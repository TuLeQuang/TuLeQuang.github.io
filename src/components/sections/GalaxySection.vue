<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GalaxyBackground from '@/components/galaxy/GalaxyBackground.vue'
import GalaxyConnections from '@/components/galaxy/GalaxyConnections.vue'
import ProfileHub from '@/components/galaxy/ProfileHub.vue'
import SkillNode from '@/components/galaxy/SkillNode.vue'
import SatelliteGrid from '@/components/galaxy/SatelliteGrid.vue'
import MobileHero from '@/components/galaxy/MobileHero.vue'
import QuickProfileStrip from '@/components/galaxy/QuickProfileStrip.vue'
import SkillGridCompact from '@/components/galaxy/SkillGridCompact.vue'
import BaStrengthsSection from '@/components/sections/BaStrengthsSection.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { resumeData } from '@/data/resume'
import type { SkillCategory, SkillCluster } from '@/types'

const { t } = useI18n()
const { isMobile } = useBreakpoint()
const canvas = ref<HTMLElement | null>(null)

const cluster = (id: SkillCategory): SkillCluster => {
  const found = resumeData.skillClusters.find(c => c.id === id)
  if (!found) throw new Error(`Missing skill cluster: ${id}`)
  return found
}
</script>

<template>
  <section
    id="all-about-me"
    class="relative w-full bg-linear-to-b from-[#0f172a] via-[#131b2e] to-[#0b1326] flex flex-col items-center justify-center overflow-hidden px-gutter-mobile sm:px-gutter pt-2 md:pt-4 pb-4 md:pb-6 select-none"
  >
    <span id="skill-galaxy" class="absolute -top-20 pointer-events-none" aria-hidden="true" />
    <GalaxyBackground />

    <!-- Mobile: hero → quick profile → BA strengths → compact skill map (Q-M1) -->
    <div v-if="isMobile" class="relative w-full max-w-md flex flex-col z-10">
      <MobileHero />
      <QuickProfileStrip />
      <BaStrengthsSection />
      <SkillGridCompact />
    </div>

    <!-- Polar canvas -->
    <div v-else ref="canvas" class="relative w-full max-w-[1240px] flex flex-col items-center z-10">
      <GalaxyConnections :container="canvas" />

      <!-- Top orbit: Database -->
      <div class="relative mb-4 lg:mb-5 z-20">
        <SkillNode :cluster="cluster('database')" width-class="w-[280px] sm:w-[320px]" />
      </div>

      <!-- Mid orbit: Frontend │ Hub │ Backend -->
      <div class="w-full flex flex-col lg:flex-row items-center justify-between gap-space-lg lg:gap-space-xl relative my-3 lg:my-4">
        <div class="relative order-2 lg:order-1 z-20">
          <SkillNode :cluster="cluster('frontend')" width-class="w-[260px] sm:w-[290px]" />
        </div>
        <div class="relative order-1 lg:order-2 z-30 max-w-[420px] w-full">
          <ProfileHub />
        </div>
        <div class="relative order-3 z-20">
          <SkillNode :cluster="cluster('backend')" width-class="w-[260px] sm:w-[290px]" />
        </div>
      </div>

      <!-- Bottom orbit: Analysis -->
      <div class="relative mt-4 lg:mt-5 z-20">
        <SkillNode :cluster="cluster('analysis')" width-class="w-[300px] sm:w-[360px]" />
      </div>

      <p class="relative z-20 mt-2 mb-0 text-label-md text-on-surface-variant/80 flex items-center gap-space-xs">
        <span class="material-symbols-outlined text-[16px] text-primary">touch_app</span>
        {{ t('galaxy.hint') }}
      </p>

      <SatelliteGrid />
    </div>
  </section>
</template>
