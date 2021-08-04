import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../layout/BaseLayout.vue'

const routes = [
  {
    path: '/',
    redirect: {name: "dashboard-list"},
    name: 'Layout',
    component: BaseLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard/list',
        component: () => import('@/views/dashboard/ListTest.vue'),
        name: 'dashboard-list',
        meta: { title: 'Test List', affix: true}
      },
      {
        path: '/project/list',
        component: () => import('@/views/project/ListProject.vue'),
        name: 'project-list',
        meta: { title: 'List Project', affix: true}
      },
      {
        path: '/project/create',
        component: () => import('@/views/project/CreateNew.vue'),
        name: 'project-create',
        meta: { title: 'Create New Project', affix: true}
      },
      {
        path: '/project/edit/:id',
        component: () => import('@/views/project/EditProject.vue'),
        name: 'project-edit',
        meta: { title: 'Edit Project', affix: true}
      },
      {
        path: '/project/analysis/:id',
        component: () => import('@/views/project/AnalysisChart.vue'),
        name: 'project-analysis',
        meta: { title: 'Project Analysis', affix: true}
      },
      {
        path: '/upload/files',
        component: () => import('@/views/upload/UploadFiles.vue'),
        name: 'upload-files',
        meta: { title: 'Upload Files', affix: true}
      },
      {
        path: '/upload/files/test',
        component: () => import('@/views/upload/UploadTestFiles.vue'),
        name: 'upload-test',
        meta: { title: 'Upload Test', affix: true}
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/user/LoginPage.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/user/RegisterPage.vue'),
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
