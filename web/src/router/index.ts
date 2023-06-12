import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import PortalPage from '@/views/PortalPage.vue';
import ConcertPage from '@/views/concert/index.vue';
import TimeTablePage from '@/views/concert/TimeTablePage.vue';
import FeedbackPage from '@/views/concert/FeedbackPage.vue';
import RepertoirePage from '@/views/RepertoirPage.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',

    component: HomePage,
  },
  {
    path: '/portal',

    component: PortalPage,
  },
  {
    path: '/repertoire',

    component: RepertoirePage,
  },
  {
    path: '/concerts/:id',

    component: ConcertPage,
  },
  {
    path: '/concerts/:id/programma',
    name: 'programma',
    component: TimeTablePage,
  },
  {
    path: '/concerts/:id/feedback',
    name: 'feedback',
    component: FeedbackPage,
  },
];

const router = createRouter({
  scrollBehavior(to) {
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
