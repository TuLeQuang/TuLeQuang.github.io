<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { careerYears, currentYear } from '@/utils/experience'
import { socialIcons } from '@/utils/styleMaps'

const { t } = useI18n()
const { email, socialLinks } = resumeData.personalInfo
const socials = socialLinks.filter(link => link.url)
const links = [
  { href: '#skill-galaxy', key: 'footer.links.galaxy' },
  { href: '#the-builder', key: 'footer.links.builder' },
  { href: '#the-transition', key: 'footer.links.transition' },
  { href: '#the-analyst', key: 'footer.links.analyst' }
]
const iconButton =
  'w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors'
</script>

<template>
  <footer class="w-full bg-surface-container-lowest text-on-surface-variant">
    <div class="w-full px-gutter-mobile sm:px-gutter lg:px-margin py-space-lg md:py-space-2xl">
      <div class="hidden md:grid grid-cols-1 md:grid-cols-12 gap-space-xl items-start pb-space-2xl">
        <div class="md:col-span-5 flex flex-col gap-space-sm">
          <div class="flex items-center gap-space-sm">
            <span class="text-headline-md text-on-surface tracking-tight">{{ t('profile.name') }}</span>
            <span class="px-space-sm py-space-xs rounded-full bg-surface-container-high text-label-sm text-secondary">
              {{ t('footer.badge') }}
            </span>
          </div>
          <p class="text-body-md text-on-surface-variant max-w-md">{{ t('footer.tagline', { n: careerYears() }) }}</p>
        </div>

        <div class="md:col-span-4 flex flex-col gap-space-sm">
          <span class="text-headline-sm text-on-surface">{{ t('footer.navTitle') }}</span>
          <div class="flex flex-col gap-space-xs text-body-md">
            <a v-for="link in links" :key="link.href" class="hover:text-on-surface transition-colors" :href="link.href">
              {{ t(link.key) }}
            </a>
          </div>
        </div>

        <div class="md:col-span-3 flex flex-col gap-space-sm">
          <span class="text-headline-sm text-on-surface">{{ t('footer.direct') }}</span>
          <div class="flex flex-col gap-space-xs text-body-md">
            <span class="text-on-surface-variant">{{ t('profile.location') }}</span>
            <a class="hover:text-primary transition-colors" :href="`mailto:${email}`">{{ email }}</a>
            <div class="flex items-center gap-space-md pt-space-xs">
              <a
                v-for="link in socials"
                :key="link.platform"
                :aria-label="link.platform"
                :class="iconButton"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="material-symbols-outlined text-[20px]">{{ socialIcons[link.icon] }}</span>
              </a>
              <a :aria-label="email" :class="iconButton" :href="`mailto:${email}`">
                <span class="material-symbols-outlined text-[20px]">mail</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-label-md text-outline">
        <p>{{ t('footer.rights', { year: currentYear() }) }}</p>
        <p>{{ t('footer.built') }}</p>
      </div>
    </div>
  </footer>
</template>
