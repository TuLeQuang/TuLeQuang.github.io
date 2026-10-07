<script setup lang="ts">
import { domainStyles } from '@/utils/styleMaps'
import type { ProjectDomain } from '@/types'
import { useCv } from '@/composables/useCv'

defineProps<{ domain: ProjectDomain }>()

const cv = useCv()
</script>

<template>
  <span
    class="px-space-sm py-0.5 rounded-full text-label-sm font-bold uppercase flex items-center gap-1"
    :class="domainStyles[domain].chip"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="domainStyles[domain].dot" />
    {{ cv.domains[domain] }}
  </span>
</template>
