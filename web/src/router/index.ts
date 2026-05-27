import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '../views/home.vue';
import BlankLayout from '@/layouts/BlankLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

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
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'repertoire',
        component: RepertoirePage,
      },
      {
        path: 'concerts/:id',
        component: ConcertPage,
      },
      {
        path: 'concerts/:id/feedback',
        name: 'feedback',
        component: FeedbackPage,
      },
      {
        path: 'portal',
        component: PortalPage,
      },
      {
        path: 'members',
        name: 'members',
        component: MembersPage,
      },
      {
        path: 'members/:id',
        name: 'member',
        component: MemberPage,
      },
    ],
  },
  {
    path: '/',
    component: BlankLayout,
    children: [
      {
        path: 'concerts/:id/programma',
        name: 'programma',
        component: TimeTablePage,
      },
    ],
  },
];

if (import.meta.env.DEV) {
  routes.push(
    {
      path: '/__preview',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'preview-index',
          component: () => import('@/views/dev/index.vue'),
        },
      ],
    },
    {
      path: '/__preview/program-booklet',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'program-booklet-preview',
          component: () => import('@/views/dev/program-booklet-preview.vue'),
        },
      ],
    },
    {
      path: '/__preview/legacy-timetable',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'legacy-timetable-preview',
          component: () => import('@/views/dev/legacy-timetable-preview.vue'),
        },
      ],
    },
    {
      path: '/__preview/impact',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'impact-preview',
          component: () => import('@/views/dev/program-impact.vue'),
        },
      ],
    },
  );
}

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
