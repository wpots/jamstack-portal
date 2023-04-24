import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/portal",
    name: "Portal",
    component: () => import(/* webpackChunkName: "portal" */ "../views/PortalPage.vue"),
  },
  {
    path: "/concerts/:id",
    name: "concert",
    component: () => import(/* webpackChunkName: "concert" */ "../views/concert/index.vue"),
  },
  {
    path: "/concerts/:id/programma",
    name: "program",
    component: () => import(/* webpackChunkName: "program" */ "../views/concert/TimeTablePage.vue"),
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
