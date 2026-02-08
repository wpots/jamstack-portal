import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import store, { key } from "./store";

/* STYLES IMPORT, inline in DEV, single css file in PRD */
import "./assets/styles/main.scss";

/* PLUGINS IMPORT */
import lazyload from "./plugins/lazyload.js";

createApp(App).use(store, key).use(router).use(lazyload).mount("#app");
