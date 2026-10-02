<script setup lang="ts">
import { resumeData } from '@/data/resume'

const { personalInfo } = resumeData
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-slate-900 text-slate-400 py-12">
    <div class="container mx-auto px-6 text-center">
      <div class="flex justify-center gap-6 mb-6">
        <a
          v-for="social in personalInfo.socialLinks"
          :key="social.platform"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-slate-400 hover:text-white transition-colors"
          :aria-label="social.platform"
        >
          {{ social.platform }}
        </a>
      </div>
      <p class="text-sm">
        &copy; {{ currentYear }} {{ personalInfo.name }}. All rights reserved.
      </p>
    </div>
  </footer>
</template>
