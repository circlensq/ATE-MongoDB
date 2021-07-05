import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../layout/BaseLayout.vue'

const routes = [
  {
    path: '/',
    redirect: {name: "dashboard-list"},
    name: 'Layout',
    component: BaseLayout,
    // meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard/list',
        component: () => import('@/views/dashboard/List.vue'),
        name: 'dashboard-list',
        meta: { title: 'Test List', affix: true}
      },
      {
        path: '/project/create',
        component: () => import('@/views/project/Create.vue'),
        name: 'project-create',
        meta: { title: 'Create New Project', affix: true}
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/user/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/user/Register.vue'),
  },
  // {
  //   path: '/forgotpassword',
  //   name: 'ForgotPassword',
  //   component: () => import('@/views/user/ForgotPassword.vue'),
  // },
  // {
  //   path: '/confirm',
  //   name: 'confirm-account',
  //   component: () => import('@/views/user/Confirm.vue'),
  // },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user')
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login')
  }
  next()
})

export default router
