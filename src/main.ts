import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Lazyload from 'vue3-lazyload';
import router from './router'

const app = createApp(App);
app.use(Lazyload, {
  loading: '@/assets/loading.svg',
});
app.use(router);
app.mount('#app')
