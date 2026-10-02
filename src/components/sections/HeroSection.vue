<script setup lang="ts">
import { resumeData } from '@/data/resume'

const { personalInfo } = resumeData
</script>

<template>
  <section id="hero" class="min-h-screen flex items-center justify-center pt-16">
    <div class="container mx-auto px-6 text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
        {{ personalInfo.name }}
      </h1>
      <p class="text-xl md:text-2xl text-blue-600 font-medium mb-6">
        {{ personalInfo.title }}
      </p>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
        {{ personalInfo.tagline }}
      </p>
      <div class="flex justify-center gap-4">
        <a
          href="#contact"
          class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get In Touch
        </a>
        <a
          href="#projects"
          class="px-8 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
        >
          View Projects
        </a>
      </div>
    </div>
  </section>
</template>
