<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { domainStyles } from '@/utils/styleMaps'
import type { ProjectDomain } from '@/types'

defineProps<{ domain: ProjectDomain }>()

const { t } = useI18n()
</script>

<template>
  <span
    class="px-space-sm py-0.5 rounded-full text-label-sm font-bold uppercase flex items-center gap-1"
    :class="domainStyles[domain].chip"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="domainStyles[domain].dot" />
    {{ t(`domains.${domain}`) }}
  </span>
</template>
