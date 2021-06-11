import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../layout/BaseLayout.vue'
// import axios from 'axios'

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard/analysis',
    component: BaseLayout,
    // beforeEnter: (to, from) => {
    //   // reject the navigation
    //   return false
    // },
    children: [
      {
        path: '/dashboard/analysis',
        component: () => import('@/views/Home.vue'),
        name: 'Analysis',
        meta: { title: 'Analysis', affix: true}
      },
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

export default router
