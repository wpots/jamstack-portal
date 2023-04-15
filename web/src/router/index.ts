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
    component: () => import(/* webpackChunkName: "portal" */ "../views/concert/index.vue"),
  },
  {
    path: "/concerts/:id/programma",
    name: "concert",
    component: () => import(/* webpackChunkName: "portal" */ "../views/concert/setListPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
