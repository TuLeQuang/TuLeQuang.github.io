<template>
  <div 
    class="glass-card md:absolute md:top-0 md:left-0 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[280px] p-6 text-center border-2 border-white/30 z-20 bg-white/15 shadow-xl hover:shadow-white/10 transition-all duration-300 relative"
    @mouseenter="$emit('hover', true)"
    @mouseleave="$emit('hover', false)"
  >
    <!-- Background Glow inside the card -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 to-transparent blur-xl -z-10 rounded-2xl pointer-events-none"></div>

    <div class="w-24 h-24 rounded-full bg-slate-700 mx-auto mb-4 border-4 border-slate-600 overflow-hidden flex items-center justify-center">
      <span class="text-3xl">👨‍💻</span>
    </div>
    <h1 class="text-2xl font-bold mb-1">{{ name }}</h1>
    <p class="text-sm text-slate-300 mb-1 font-medium">{{ title }}</p>
    <p v-if="subtitle" class="text-xs text-blue-300 mb-2 font-medium">→ {{ subtitle }}</p>
    <p v-if="tagline" class="text-[11px] text-slate-400 mb-3 italic leading-relaxed px-2">{{ tagline }}</p>
    <div class="flex flex-col items-center gap-1 mb-4 text-xs text-slate-400">
      <span>📍 {{ location }}</span>
      <a v-if="email" :href="`mailto:${email}`" class="hover:text-blue-300 transition-colors">✉️ {{ email }}</a>
      <span v-if="phone">📱 {{ phone }}</span>
    </div>
    
    <div class="flex justify-center gap-3">
      <a 
        v-for="link in socialLinks" 
        :key="link.platform"
        :href="link.url" 
        target="_blank" 
        class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-sm"
        :title="link.platform"
      >
        {{ link.icon === 'facebook' ? '📘' : link.icon === 'github' ? '🐙' : '💼' }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  title: string
  subtitle?: string
  tagline?: string
  email?: string
  phone?: string
  location: string
  socialLinks: Array<{ platform: string; url: string; icon: string }>
}

defineProps<Props>()

defineEmits<{
  hover: [value: boolean]
}>()
</script>

<style scoped>
@reference 'tailwindcss';

.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4;
}
</style>
