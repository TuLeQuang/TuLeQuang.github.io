import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import { applyLocaleSideEffects } from './composables/useLocale'
import { reveal } from './composables/useReveal'
import './style.css'

const app = createApp(App)
app.use(i18n)
app.directive('reveal', reveal)
applyLocaleSideEffects(i18n.global.locale.value)
app.mount('#app')
