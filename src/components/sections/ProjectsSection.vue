<script setup lang="ts">
import { resumeData } from '@/data/resume'

const projects = resumeData.projects
</script>

<template>
  <section id="projects" class="py-20">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-12">
        Projects
      </h2>
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div
          v-for="project in projects"
          :key="project.title"
          class="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <h3 class="text-xl font-semibold text-slate-900 mb-2">
              {{ project.title }}
            </h3>
            <p class="text-slate-600 mb-4">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded"
              >
                {{ tech }}
              </span>
            </div>
            <div class="flex gap-4">
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Live Demo →
              </a>
              <a
                v-if="project.sourceUrl"
                :href="project.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Source Code →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
