import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

createApp(App).use(router).use(PrimeVue, { ripple: true }).use(ToastService).mount('#app')
