import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../layout/BaseLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard/analysis',
    component: BaseLayout,
    children: [
      {
        path: '/dashboard/analysis',
        component: () => import('@/views/Home.vue'),
        name: 'Analysis',
        meta: { title: 'Analysis', affix: true}
      }
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
  {
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component: () => import('@/views/user/ForgotPassword.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
