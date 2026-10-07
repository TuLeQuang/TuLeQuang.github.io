<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import StarfieldBackground from '@/components/common/StarfieldBackground.vue'
import { resumeData } from '@/data/resume'
import { BA_START, CAREER_START, baYears, careerYears } from '@/utils/experience'
import { fill, useCv } from '@/composables/useCv'

const { t } = useI18n()
const cv = useCv()

/** Every number comes from data so the stats never drift from the rest of the page. */
const stats = [
  { key: 'devYears', value: `${careerYears()}+` },
  { key: 'baYears', value: `${baYears()}+` },
  { key: 'projects', value: `${resumeData.projects.length}` },
  { key: 'domains', value: `${resumeData.baDomains.length}` },
  { key: 'honors', value: `🏆 ${resumeData.achievements.length}` }
]

/** Mobile journey: the BA award year comes from its timeline milestone. */
const award = resumeData.achievements.find(a => a.track === 'analyst' && a.projectSlug)
const awardYear = resumeData.analystTimeline.find(m => m.achievementId === award?.id)?.year ?? ''
const journey = [
  { key: 'dev' as const, year: `${CAREER_START}` },
  { key: 'hybrid' as const, year: `${BA_START}` },
  { key: 'ba' as const, year: awardYear }
]
</script>

<template>
  <section
    id="the-pivot-story"
    class="relative w-full bg-linear-to-b from-content-bg via-surface to-background px-gutter-mobile sm:px-gutter lg:px-margin py-space-2xl md:py-space-3xl select-none overflow-hidden"
  >
    <span id="the-transition" class="absolute -top-20 pointer-events-none" aria-hidden="true" />
    <StarfieldBackground
      :star-count="{ desktop: 200, mobile: 70 }"
      mask-class="fade-top-mask"
    />
    <div class="relative z-10 max-w-4xl mx-auto">
      <div
        v-reveal
        class="relative rounded-2xl bg-linear-to-br from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-space-xl sm:p-space-2xl text-white shadow-[0_20px_50px_-15px_rgba(37,99,235,0.4)] overflow-hidden"
      >
        <div class="absolute inset-0 opacity-15 pointer-events-none" aria-hidden="true">
          <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
            <path d="M0,50 Q100,0 200,50 T400,50 L400,200 L0,200 Z" fill="currentColor" />
          </svg>
        </div>

        <div class="relative z-10 flex flex-col items-center text-center">
          <div class="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-white/20 backdrop-blur-md text-label-sm uppercase tracking-wider font-bold mb-space-md">
            <span class="material-symbols-outlined text-[16px]">transform</span>
            {{ t('transition.eyebrow') }}
          </div>
          <blockquote class="text-headline-xl-mobile md:text-headline-xl text-white tracking-tight leading-snug max-w-2xl">
            {{ fill(cv.narrative.transition.quote, { n: careerYears() }) }}
          </blockquote>
          <p class="text-body-lg text-white/90 mt-space-md max-w-xl hidden md:block">{{ cv.narrative.transition.body }}</p>
          <p class="text-body-md text-white/90 mt-space-sm md:hidden">{{ cv.narrative.transition.bodyShort }}</p>

          <!-- Mobile mini journey: Dev → Dev + BA → BA (award) -->
          <ol class="md:hidden w-full mt-space-lg flex items-stretch gap-1 text-left">
            <li v-for="(step, index) in journey" :key="step.key" class="flex-1 flex items-center gap-1">
              <div class="flex-1 rounded-lg bg-white/15 backdrop-blur-md px-space-xs py-space-xs">
                <span class="block text-headline-sm text-white">{{ step.year }}</span>
                <span class="block text-label-sm text-white/85 leading-tight">{{ cv.narrative.transition.journey[step.key] }}</span>
              </div>
              <span v-if="index < journey.length - 1" class="material-symbols-outlined text-[16px] text-white/70" aria-hidden="true">arrow_forward</span>
            </li>
          </ol>

          <div class="w-full mt-space-lg md:mt-space-2xl pt-space-lg">
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-space-md text-center">
              <div
                v-for="(stat, index) in stats"
                :key="stat.key"
                class="flex flex-col"
                :class="{ 'col-span-2 sm:col-span-1': index === stats.length - 1 }"
              >
                <span class="text-headline-xl font-bold text-white">{{ stat.value }}</span>
                <span class="text-label-sm text-white/80 uppercase">{{ t(`transition.stats.${stat.key}`) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
