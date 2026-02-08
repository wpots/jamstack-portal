import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '../views/home.vue';

import ConcertPage from '@/views/concert/_id.vue';
import TimeTablePage from '@/views/concert/timetable.vue';
import FeedbackPage from '@/views/concert/feedback.vue';
import RepertoirePage from '@/views/repertoire.vue';

import PortalPage from '@/views/portal.vue';
import MembersPage from '@/views/members/index.vue';
import MemberPage from '@/views/members/_id.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',

    component: HomePage,
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
  {
    path: '/portal',

    component: PortalPage,
  },
  {
    path: '/members',
    name: 'members',
    component: MembersPage,
  },
  {
    path: '/members/:id',
    name: 'member',
    component: MemberPage,
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
