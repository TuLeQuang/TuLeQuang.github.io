<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCv } from '@/composables/useCv'
import { currentYear } from '@/utils/experience'

const { t } = useI18n()
const cv = useCv()
</script>

<template>
  <footer class="w-full bg-surface-container-lowest text-on-surface-variant">
    <div class="w-full px-gutter-mobile sm:px-gutter lg:px-margin py-space-lg">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-space-md text-label-md text-outline">
        <p>{{ t('footer.rights', { year: currentYear(), name: cv.profile.name }) }}</p>
        <p>{{ t('footer.built') }}</p>
      </div>
    </div>
  </footer>
</template>
