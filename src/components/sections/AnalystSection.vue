<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeader from '@/components/common/SectionHeader.vue'
import AnalystSkills from '@/components/timeline/AnalystSkills.vue'
import DomainMatrix from '@/components/timeline/DomainMatrix.vue'
import ProjectBentoGrid from '@/components/timeline/ProjectBentoGrid.vue'
import TimelineTrack from '@/components/timeline/TimelineTrack.vue'
import YearRail from '@/components/timeline/YearRail.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { resumeData } from '@/data/resume'
import { baYears } from '@/utils/experience'
import { fill, useCv } from '@/composables/useCv'

const { t } = useI18n()
const cv = useCv()
const { isMobile } = useBreakpoint()
</script>

<template>
  <section id="the-analyst" class="w-full bg-content-bg text-text-primary px-gutter-mobile sm:px-gutter lg:px-margin py-space-2xl md:py-space-3xl">
    <div class="max-w-7xl mx-auto flex flex-col gap-space-xl md:gap-space-2xl">
      <SectionHeader
        tone="analyst"
        :eyebrow="t('analyst.eyebrow')"
        :title="t('analyst.title')"
        :subtitle="fill(cv.narrative.analyst.subtitle, { n: baYears() })"
        :meta-label="t('analyst.metaLabel')"
        :meta-value="cv.narrative.analyst.meta"
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
        <AnalystSkills />
        <DomainMatrix v-if="!isMobile" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg md:gap-space-xl items-start">
        <YearRail
          v-if="isMobile"
          :milestones="resumeData.analystTimeline"
          :title="t('analyst.timelineTitle')"
          icon="account_tree"
          tone="analyst"
        />
        <TimelineTrack
          v-else
          :milestones="resumeData.analystTimeline"
          :title="t('analyst.timelineTitle')"
          icon="account_tree"
          icon-class="text-domain-ai"
          rail-class="before:bg-secondary-purple-light"
          :dot-classes="['bg-domain-crm', 'bg-domain-ai', 'bg-domain-iot', 'bg-primary-container', 'bg-slate-400']"
        />
        <ProjectBentoGrid track="analyst" />
      </div>
    </div>
  </section>
</template>
