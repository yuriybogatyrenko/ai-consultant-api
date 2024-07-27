import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/cabinet',
    name: 'cabinet',
    component: () =>
      import(
        /* webpackChunkName: "cabinet" */ '../views/cabinet/CabinetLayout.vue'
      ),
    children: [
      {
        path: 'api-keys',
        name: 'cabinet-api-keys',
        component: () =>
          import(
            /* webpackChunkName: "cabinet-api-keys" */ '../views/cabinet/ApiKeyView.vue'
          ),
      },
      {
        path: 'platforms',
        name: 'cabinet-platforms',
        component: () =>
          import(
            /* webpackChunkName: "cabinet-platforms" */ '../views/cabinet/PlatformsView.vue'
          ),
      },
    ],
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/auth/LoginView.vue'),
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () =>
      import(
        /* webpackChunkName: "register" */ '../views/auth/RegisterView.vue'
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
