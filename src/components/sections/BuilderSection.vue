<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeader from '@/components/common/SectionHeader.vue'
import BuilderSkills from '@/components/timeline/BuilderSkills.vue'
import ProjectBentoGrid from '@/components/timeline/ProjectBentoGrid.vue'
import TimelineTrack from '@/components/timeline/TimelineTrack.vue'
import YearRail from '@/components/timeline/YearRail.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { resumeData } from '@/data/resume'
import { careerYears } from '@/utils/experience'

const { t } = useI18n()
const { isMobile } = useBreakpoint()
</script>

<template>
  <section id="the-builder" class="w-full bg-content-bg text-text-primary px-gutter-mobile sm:px-gutter lg:px-margin py-space-2xl md:py-space-3xl">
    <div class="max-w-7xl mx-auto flex flex-col gap-space-xl md:gap-space-2xl">
      <SectionHeader
        tone="builder"
        :eyebrow="t('builder.eyebrow')"
        :title="t('builder.title')"
        :subtitle="t('builder.subtitle', { n: careerYears() })"
        :meta-label="t('builder.metaLabel')"
        :meta-value="t('builder.metaValue')"
      />

      <BuilderSkills />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg md:gap-space-xl items-start">
        <YearRail
          v-if="isMobile"
          :milestones="resumeData.builderTimeline"
          :title="t('builder.timelineTitle')"
          icon="route"
          tone="builder"
        />
        <TimelineTrack
          v-else
          :milestones="resumeData.builderTimeline"
          :title="t('builder.timelineTitle')"
          icon="route"
          icon-class="text-primary-container"
          rail-class="before:bg-primary-blue-light"
          :dot-classes="['bg-primary-container', 'bg-primary-blue-dark', 'bg-tertiary', 'bg-slate-400', 'bg-slate-300']"
        />
        <ProjectBentoGrid track="builder" />
      </div>
    </div>
  </section>
</template>
