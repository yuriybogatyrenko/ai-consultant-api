import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
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
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/',
    component: () =>
      import(
        /* webpackChunkName: "cabinet" */ '../views/cabinet/CabinetLayout.vue'
      ),
    children: [
      {
        path: 'accounts',
        name: 'cabinet-accounts',
        component: () =>
          import(
            /* webpackChunkName: "cabinet-accounts" */ '../views/cabinet/account/AccountsView.vue'
          ),
      },
      {
        path: 'accounts/:account_id',
        name: 'cabinet-account',
        component: () =>
          import(
            /* webpackChunkName: "cabinet-accounts" */ '../views/cabinet/account/AccountView.vue'
          ),
      },
      {
        path: 'accounts/:account_id/gpt-settings',
        name: 'gpt-settings',
        component: () =>
          import(
            /* webpackChunkName: "gpt-settings" */ '../views/cabinet/gpt-api/GptApiView.vue'
          ),
      },
      {
        path: 'accounts/:account_id/custom-fields',
        name: 'custom-fields',
        component: () =>
          import(
            /* webpackChunkName: "custom-fields" */ '../views/cabinet/custom-fields/CustomFieldsView.vue'
          ),
      },
      {
        path: 'api-keys',
        name: 'cabinet-api-keys',
        component: () =>
          import(
            /* webpackChunkName: "cabinet-api-keys" */ '../views/cabinet/api-keys/ApiKeyView.vue'
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
