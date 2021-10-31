import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

/* STYLES IMPORT, inline in DEV, single css file in PRD */
import './assets/styles/main.scss';

/* PLUGINS IMPORT */
import './composable/progressiveMedia';

createApp(App).use(store).use(router).mount('#app');
