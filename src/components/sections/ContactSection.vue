<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ContactActions from '@/components/common/ContactActions.vue'
import ContactBackground from '@/components/contact/ContactBackground.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import { resumeData } from '@/data/resume'
import { cvFileName, cvHref } from '@/utils/contact'
import { formatPhone, socialIcons } from '@/utils/styleMaps'
import type { Locale } from '@/types'
import { useCv } from '@/composables/useCv'

const { t, locale } = useI18n()
const cv = useCv()
const current = computed(() => locale.value as Locale)
const { email, phone, socialLinks } = resumeData.personalInfo
const socials = socialLinks.filter(link => link.url)
const card = 'flex flex-col gap-space-md p-space-lg sm:p-space-xl rounded-xl bg-surface-container/60 backdrop-blur-md border border-outline-variant/20'
const row = 'flex items-center gap-space-sm text-on-surface-variant p-space-xs rounded-lg'
</script>

<template>
  <section id="contact" class="relative w-full bg-[#0f172a] text-on-surface px-gutter-mobile sm:px-gutter lg:px-margin py-space-2xl md:py-space-3xl overflow-hidden select-none">
    <ContactBackground />
    <div class="relative z-10 max-w-7xl mx-auto flex flex-col gap-space-xl md:gap-space-2xl">
      <SectionHeader
        tone="contact"
        :eyebrow="t('contact.eyebrow')"
        :title="t('contact.title')"
        :subtitle="cv.narrative.contact.subtitle"
      />

      <!-- Mobile: large tap targets (Email · Call · CV) -->
      <div v-reveal class="md:hidden flex flex-col gap-space-sm">
        <ContactActions tone="dark" />
        <div :class="row" class="justify-center">
          <span class="material-symbols-outlined text-tertiary text-[20px]">pin_drop</span>
          <span>{{ cv.profile.location }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
        <!-- Identity -->
        <div v-reveal :class="card">
          <div class="flex items-center gap-space-sm">
            <span class="text-3xl" aria-hidden="true">👨‍💻</span>
            <div>
              <h3 class="text-headline-md text-on-surface">{{ cv.profile.name }}</h3>
              <span class="text-label-sm text-primary uppercase tracking-wider font-semibold">
                {{ cv.profile.role }} → {{ cv.profile.targetRole }}
              </span>
            </div>
          </div>
          <p class="text-body-md text-on-surface-variant leading-relaxed">{{ cv.narrative.contact.identity }}</p>
          <div class="flex items-center gap-space-xs text-label-md text-tertiary">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>{{ cv.profile.objective }}</span>
          </div>
        </div>

        <!-- Direct coordinates (desktop; mobile uses ContactActions above) -->
        <div v-reveal="100" :class="card" class="max-md:hidden">
          <h4 class="text-headline-sm text-on-surface flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary text-[20px]">contacts</span>
            <span>{{ t('contact.direct') }}</span>
          </h4>
          <div class="flex flex-col gap-space-sm text-body-md">
            <a :class="row" class="hover:text-primary hover:bg-surface-container transition-colors" :href="`mailto:${email}`">
              <span class="material-symbols-outlined text-primary text-[20px]">mail</span>
              <span class="select-all">{{ email }}</span>
            </a>
            <!-- Desktop has no dialer (Q-M7): plain, selectable text -->
            <div :class="row">
              <span class="material-symbols-outlined text-secondary text-[20px]">call</span>
              <span class="select-all">{{ formatPhone(phone) }}</span>
            </div>
            <div :class="row">
              <span class="material-symbols-outlined text-tertiary text-[20px]">pin_drop</span>
              <span>{{ cv.profile.location }}</span>
            </div>
            <a
              :class="row"
              class="hover:text-primary hover:bg-surface-container transition-colors"
              :href="cvHref(current)"
              :download="cvFileName(current)"
              target="_blank"
              rel="noopener"
            >
              <span class="material-symbols-outlined text-primary text-[20px]">download</span>
              <span>{{ t('contact.downloadCv') }}</span>
            </a>
          </div>
        </div>

        <!-- Profiles & networks -->
        <div v-reveal="200" :class="card">
          <h4 class="text-headline-sm text-on-surface flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-secondary text-[20px]">public</span>
            <span>{{ t('contact.profiles') }}</span>
          </h4>
          <div class="flex flex-col gap-space-sm">
            <a
              v-for="link in socials"
              :key="link.platform"
              class="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-on-primary-container transition-all"
              :href="link.url"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span class="text-label-md font-semibold flex items-center gap-space-xs">
                <span class="material-symbols-outlined text-[18px]">{{ socialIcons[link.icon] }}</span>
                {{ link.platform }}
              </span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
