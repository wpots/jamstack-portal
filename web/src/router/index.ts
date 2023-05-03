import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import PortalPage from "@/views/PortalPage.vue";
import ConcertPage from "@/views/concert/index.vue";
import TimeTablePage from "@/views/concert/TimeTablePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",

    component: HomePage,
  },
  {
    path: "/portal",

    component: PortalPage,
  },
  {
    path: "/concerts/:id",

    component: ConcertPage,
  },
  {
    path: "/concerts/:id/programma",

    component: TimeTablePage,
  },
];

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
      };
    }
  },
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
