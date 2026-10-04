<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import FloatingActions from '@/components/layout/FloatingActions.vue'
import FocusChip from '@/components/layout/FocusChip.vue'
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue'
import GalaxySection from '@/components/sections/GalaxySection.vue'
import BuilderSection from '@/components/sections/BuilderSection.vue'
import TransitionSection from '@/components/sections/TransitionSection.vue'
import AnalystSection from '@/components/sections/AnalystSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import ProjectSheet from '@/components/timeline/ProjectSheet.vue'
</script>

<template>
  <AppHeader />
  <main class="w-full pt-14 md:pt-20 bg-background">
    <!-- Mobile is BA-first (Q-M3): Galaxy → Analyst → Transition → Builder → Contact. Desktop keeps DOM order. -->
    <div class="flex flex-col w-full">
      <GalaxySection class="max-md:order-1" />
      <BuilderSection class="max-md:order-4" />
      <TransitionSection class="max-md:order-3" />
      <AnalystSection class="max-md:order-2" />
      <ContactSection class="max-md:order-5" />
    </div>
  </main>
  <!-- Mobile: leave room for the fixed bottom nav (h-16 + safe area) -->
  <AppFooter class="max-md:pb-[calc(4rem+env(safe-area-inset-bottom))]" />
  <FloatingActions />
  <FocusChip />
  <MobileBottomNav />
  <ProjectSheet />
</template>
