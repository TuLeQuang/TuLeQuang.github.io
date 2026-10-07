<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { baYears, careerYears } from '@/utils/experience'
import { scrollToSection } from '@/utils/sections'
import { useCv } from '@/composables/useCv'

/**
 * Mobile "pocket hero" (section ①): who · what · how long · proof · how to reach — in one screen.
 * Desktop keeps ProfileHub inside the orbital Galaxy.
 */
const { t } = useI18n()
const cv = useCv()

/** Same sources as TransitionSection so numbers never drift. */
const stats = [
  { key: 'devYears', value: `${careerYears()}+` },
  { key: 'baYears', value: `${baYears()}+` },
  { key: 'honors', value: `🏆 ${resumeData.achievements.length}` }
]
const pill = 'inline-flex items-center gap-1 px-2.5 min-h-8 rounded-full text-label-sm font-semibold'

/** "Xem năng lực BA" → the "Why me as a BA" block right below the hero (BaStrengthsSection). */
const scrollToStrengths = (): void => {
  document.getElementById('ba-strengths')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="relative z-10 min-h-[calc(100dvh-7.5rem)] flex flex-col items-center justify-center text-center py-space-xl">
    <div class="relative mb-space-md">
      <div class="absolute -inset-3 rounded-full bg-linear-to-tr from-primary-container to-secondary-container opacity-50 blur-xl" aria-hidden="true" />
      <div class="relative w-[72px] h-[72px] rounded-full bg-linear-to-tr from-primary-blue-dark to-secondary-container flex items-center justify-center text-3xl ring-4 ring-surface-container-high">
        <span aria-hidden="true">👨‍💻</span>
        <span class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-domain-supplychain flex items-center justify-center text-surface-container-lowest text-[12px] font-bold">✓</span>
      </div>
    </div>

    <h1 class="text-display-hero-mobile text-on-surface tracking-tight">{{ cv.profile.name }}</h1>

    <div class="mt-space-sm inline-flex items-center gap-1.5 p-1 rounded-full bg-surface-container-high/70 border border-outline-variant/40">
      <button type="button" :class="[pill, 'bg-primary-container/20 border border-primary/30 text-primary-fixed']" @click="scrollToSection('the-builder')">
        <span class="material-symbols-outlined text-[14px] text-primary" aria-hidden="true">terminal</span>
        {{ cv.profile.role }}
      </button>
      <span class="material-symbols-outlined text-[16px] text-secondary" aria-hidden="true">trending_flat</span>
      <button type="button" :class="[pill, 'bg-secondary-container/40 border border-secondary/60 text-secondary-fixed font-bold']" @click="scrollToSection('the-analyst')">
        <span class="material-symbols-outlined text-[14px] text-secondary" aria-hidden="true">analytics</span>
        {{ cv.profile.targetRole }}
      </button>
    </div>

    <p class="mt-space-md max-w-xs text-body-md text-on-surface-variant line-clamp-2">{{ cv.profile.tagline }}</p>

    <dl class="mt-space-lg w-full max-w-sm grid grid-cols-3 rounded-xl border border-outline-variant/40 bg-surface-container/60 backdrop-blur-md divide-x divide-outline-variant/40">
      <div v-for="stat in stats" :key="stat.key" class="py-space-sm flex flex-col-reverse">
        <dt class="text-label-sm text-on-surface-variant uppercase">{{ t(`transition.stats.${stat.key}`) }}</dt>
        <dd class="text-headline-lg text-on-surface">{{ stat.value }}</dd>
      </div>
    </dl>

    <div class="mt-space-lg w-full max-w-sm grid grid-cols-2 gap-space-sm">
      <button
        type="button"
        class="min-h-12 rounded-xl bg-primary-container text-on-primary-container text-headline-sm inline-flex items-center justify-center gap-1 shadow-lg"
        @click="scrollToSection('contact')"
      >
        <span class="material-symbols-outlined text-[18px]">mail</span>
        {{ t('hero.ctaContact') }}
      </button>
      <button
        type="button"
        class="min-h-12 rounded-xl bg-secondary-container/50 border border-secondary/50 text-secondary-fixed text-headline-sm inline-flex items-center justify-center gap-1"
        @click="scrollToStrengths"
      >
        <span class="material-symbols-outlined text-[18px]">analytics</span>
        {{ t('hero.ctaAnalyst') }}
      </button>
    </div>

    <span class="mt-space-xl text-label-sm text-on-surface-variant/80 inline-flex flex-col items-center motion-safe:animate-bounce">
      {{ t('hero.scrollHint') }}
      <span class="material-symbols-outlined text-[18px]">expand_more</span>
    </span>
  </div>
</template>
