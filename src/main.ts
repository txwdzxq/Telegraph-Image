import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import LazyLoad from 'vue3-lazyload';
import router from './router'

const app = createApp(App);
app.use(LazyLoad, {
  loading: '@/loading.svg',
  preload: 1.5
});
app.use(router);
app.mount('#app')
