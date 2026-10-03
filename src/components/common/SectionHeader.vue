<script setup lang="ts">
type Tone = 'builder' | 'analyst' | 'contact'

const props = defineProps<{
  eyebrow: string
  title: string
  subtitle: string
  metaLabel?: string
  metaValue?: string
  tone: Tone
}>()

const tones: Record<Tone, { eyebrow: string; title: string; subtitle: string; meta: string }> = {
  builder: {
    eyebrow: 'bg-primary-blue-light text-primary-blue-dark',
    title: 'text-primary-container',
    subtitle: 'text-text-secondary',
    meta: 'text-text-primary'
  },
  analyst: {
    eyebrow: 'bg-secondary-purple-light text-domain-ai-text',
    title: 'text-domain-ai',
    subtitle: 'text-text-secondary',
    meta: 'text-domain-ai-text'
  },
  contact: {
    eyebrow: 'bg-primary/20 text-primary',
    title: 'text-on-surface',
    subtitle: 'text-on-surface-variant',
    meta: 'text-on-surface'
  }
}

const style = tones[props.tone]
</script>

<template>
  <div v-reveal class="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md pb-space-lg">
    <div>
      <div
        class="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full text-label-md font-bold mb-space-xs"
        :class="style.eyebrow"
      >
        <span>{{ eyebrow }}</span>
      </div>
      <h2 class="text-headline-xl-mobile md:text-headline-xl flex items-center gap-space-sm" :class="style.title">
        <span>{{ title }}</span>
      </h2>
      <p class="text-headline-md mt-1" :class="style.subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="metaLabel && metaValue" class="text-left sm:text-right">
      <span class="text-label-md text-text-muted uppercase tracking-widest block">{{ metaLabel }}</span>
      <span class="text-headline-sm" :class="style.meta">{{ metaValue }}</span>
    </div>
  </div>
</template>
