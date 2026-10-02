<script setup lang="ts">
import { resumeData } from '@/data/resume'

const { personalInfo } = resumeData
</script>

<template>
  <section id="contact" class="py-20 bg-slate-50">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold text-slate-900 mb-4">
        Get In Touch
      </h2>
      <p class="text-lg text-slate-600 max-w-xl mx-auto mb-8">
        I'm always open to new opportunities and interesting projects.
        Feel free to reach out!
      </p>
      <a
        :href="`mailto:${personalInfo.email}`"
        class="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Say Hello
      </a>
    </div>
  </section>
</template>
