<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeader from '@/components/common/SectionHeader.vue'
import { resumeData } from '@/data/resume'
import { formatPhone, socialIcons } from '@/utils/styleMaps'

const { t } = useI18n()
const { email, phone, socialLinks } = resumeData.personalInfo
const socials = socialLinks.filter(link => link.url)
const card = 'flex flex-col gap-space-md p-space-lg sm:p-space-xl rounded-xl bg-surface-container/60 backdrop-blur-md'
const row = 'flex items-center gap-space-sm text-on-surface-variant p-space-xs rounded-lg'
</script>

<template>
  <section id="contact" class="w-full bg-[#0f172a] text-on-surface px-gutter-mobile sm:px-gutter lg:px-margin py-space-3xl">
    <div class="max-w-7xl mx-auto flex flex-col gap-space-2xl">
      <SectionHeader
        tone="contact"
        :eyebrow="t('contact.eyebrow')"
        :title="t('contact.title')"
        :subtitle="t('contact.subtitle')"
      />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
        <!-- Identity -->
        <div v-reveal :class="card">
          <div class="flex items-center gap-space-sm">
            <span class="text-3xl" aria-hidden="true">👨‍💻</span>
            <div>
              <h3 class="text-headline-md text-on-surface">{{ t('profile.name') }}</h3>
              <span class="text-label-sm text-primary uppercase tracking-wider font-semibold">
                {{ t('profile.role') }} {{ t('profile.next') }}
              </span>
            </div>
          </div>
          <p class="text-body-md text-on-surface-variant leading-relaxed">{{ t('contact.identity') }}</p>
          <div class="flex items-center gap-space-xs text-label-md text-tertiary">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>{{ t('profile.objective') }}</span>
          </div>
        </div>

        <!-- Direct coordinates -->
        <div v-reveal="100" :class="card">
          <h4 class="text-headline-sm text-on-surface flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary text-[20px]">contacts</span>
            <span>{{ t('contact.direct') }}</span>
          </h4>
          <div class="flex flex-col gap-space-sm text-body-md">
            <a :class="row" class="hover:text-primary hover:bg-surface-container transition-colors" :href="`mailto:${email}`">
              <span class="material-symbols-outlined text-primary text-[20px]">mail</span>
              <span class="select-all">{{ email }}</span>
            </a>
            <a :class="row" class="hover:text-primary hover:bg-surface-container transition-colors" :href="`tel:${phone}`">
              <span class="material-symbols-outlined text-secondary text-[20px]">call</span>
              <span>{{ formatPhone(phone) }}</span>
            </a>
            <div :class="row">
              <span class="material-symbols-outlined text-tertiary text-[20px]">pin_drop</span>
              <span>{{ t('profile.location') }}</span>
            </div>
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
