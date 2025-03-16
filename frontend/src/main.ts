import {createApp} from 'vue'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import {definePreset} from '@primeuix/themes'
import ToastService from 'primevue/toastservice'

const app = createApp(App)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: definePreset(Aura, {
            semantic: {
                primary: {
                    50: '{orange.50}',
                    100: '{orange.100}',
                    200: '{orange.200}',
                    300: '{orange.300}',
                    400: '{orange.400}',
                    500: '{orange.500}',
                    600: '{orange.600}',
                    700: '{orange.700}',
                    800: '{orange.800}',
                    900: '{orange.900}',
                    950: '{orange.950}'
                }
            }
        }),
        options: {
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, components, app, primevue, utilities'
            }
        }
    }
})
app.use(ToastService)

app.mount('#app')
