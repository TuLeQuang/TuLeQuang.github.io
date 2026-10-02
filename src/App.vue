<script setup lang="ts">
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <TheHeader />
  <main>
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <ExperienceSection />
    <ProjectsSection />
    <ContactSection />
  </main>
  <TheFooter />
</template>
