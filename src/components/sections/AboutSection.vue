<script setup lang="ts">
import { resumeData } from '@/data/resume'

const { personalInfo } = resumeData
</script>

<template>
  <section id="about" class="py-20 bg-slate-50">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-12">
        About Me
      </h2>
      <div class="max-w-3xl mx-auto text-center">
        <p class="text-lg text-slate-600 leading-relaxed">
          <!-- Placeholder: Will be filled with actual content -->
          Hi, I'm {{ personalInfo.name }}. I'm a {{ personalInfo.title }}
          based in {{ personalInfo.location }}. I'm passionate about building
          great software and solving complex problems.
        </p>
      </div>
    </div>
  </section>
</template>
