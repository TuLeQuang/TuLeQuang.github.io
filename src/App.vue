<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import FloatingActions from '@/components/layout/FloatingActions.vue'
import GalaxySection from '@/components/sections/GalaxySection.vue'
import BuilderSection from '@/components/sections/BuilderSection.vue'
import TransitionSection from '@/components/sections/TransitionSection.vue'
import AnalystSection from '@/components/sections/AnalystSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <AppHeader />
  <main class="w-full pt-20 bg-background">
    <div class="flex flex-col w-full">
      <GalaxySection />
      <BuilderSection />
      <TransitionSection />
      <AnalystSection />
      <ContactSection />
    </div>
  </main>
  <AppFooter />
  <FloatingActions />
</template>
