import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../layout/BaseLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard/list',
    component: BaseLayout,
    // meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard/list',
        component: () => import('@/views/dashboard/List.vue'),
        name: 'List',
        meta: { title: 'Test List', affix: true}
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register.vue'),
  },
  // {
  //   path: '/forgotpassword',
  //   name: 'ForgotPassword',
  //   component: () => import('@/views/user/ForgotPassword.vue'),
  // },
  {
    path: '/confirm',
    name: 'ConfirmAccount',
    component: () => import('@/views/user/Confirm.vue'),
  },
  
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
