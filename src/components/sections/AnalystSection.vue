<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeader from '@/components/common/SectionHeader.vue'
import AnalystSkills from '@/components/timeline/AnalystSkills.vue'
import DomainMatrix from '@/components/timeline/DomainMatrix.vue'
import ProjectBentoGrid from '@/components/timeline/ProjectBentoGrid.vue'
import TimelineTrack from '@/components/timeline/TimelineTrack.vue'
import { resumeData } from '@/data/resume'
import { baYears } from '@/utils/experience'

const { t } = useI18n()
</script>

<template>
  <section id="the-analyst" class="w-full bg-content-bg text-text-primary px-gutter-mobile sm:px-gutter lg:px-margin py-space-3xl">
    <div class="max-w-7xl mx-auto flex flex-col gap-space-2xl">
      <SectionHeader
        tone="analyst"
        :eyebrow="t('analyst.eyebrow')"
        :title="t('analyst.title')"
        :subtitle="t('analyst.subtitle', { n: baYears() })"
        :meta-label="t('analyst.metaLabel')"
        :meta-value="t('analyst.metaValue')"
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
        <AnalystSkills />
        <DomainMatrix />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <TimelineTrack
          :milestones="resumeData.analystTimeline"
          :title="t('analyst.timelineTitle')"
          icon="account_tree"
          icon-class="text-domain-ai"
          rail-class="before:bg-secondary-purple-light"
          :dot-classes="['bg-domain-ai', 'bg-domain-iot', 'bg-primary-container', 'bg-slate-300']"
        />
        <ProjectBentoGrid track="analyst" />
      </div>
    </div>
  </section>
</template>
