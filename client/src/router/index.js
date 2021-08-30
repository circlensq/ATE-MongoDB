import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../layout/BaseLayout.vue'
import axios from 'axios'

async function checkAdminPermission () {
    let token = localStorage.getItem("user")
    try {
      let permission = await axios.create({
        baseURL: "/api",
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        }
      }).post('/superuser/', {
        token: token
      })
      console.log('permission', permission.data.is_superuser)
      if (permission.data.is_superuser)
        return true
    } catch (err) {
      console.log('Error permission: ', err)
    }
    return { path: '/unauthorized' }
}

const routes = [
  {
    path: '/',
    redirect: { name: "dashboard-list" },
    name: 'Layout',
    component: BaseLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard/list',
        component: () => import('@/views/dashboard/ListTest.vue'),
        name: 'dashboard-list',
        meta: { title: 'Test List', affix: true }
      },
      {
        path: '/project/list',
        component: () => import('@/views/project/ListProject.vue'),
        name: 'project-list',
        meta: { title: 'List Project', affix: true },
        beforeEnter: [checkAdminPermission]
      },
      {
        path: '/project/create',
        component: () => import('@/views/project/CreateNew.vue'),
        name: 'project-create',
        meta: { title: 'Create New Project', affix: true },
        beforeEnter: [checkAdminPermission]
      },
      {
        path: '/project/edit/:id',
        component: () => import('@/views/project/EditProject.vue'),
        name: 'project-edit',
        meta: { title: 'Edit Project', affix: true },
        beforeEnter: [checkAdminPermission]

      },
      {
        path: '/project/analysis/:id',
        component: () => import('@/views/project/AnalysisChart.vue'),
        name: 'project-analysis',
        meta: { title: 'Project Analysis', affix: true }
      },
      {
        path: '/upload/files',
        component: () => import('@/views/upload/UploadFiles.vue'),
        name: 'upload-files',
        meta: { title: 'Upload Files', affix: true }
      },
      {
        path: '/upload/files/test',
        component: () => import('@/views/upload/UploadTestFiles.vue'),
        name: 'upload-test',
        meta: { title: 'Upload Test', affix: true },
        beforeEnter: [checkAdminPermission]
      },
      {
        path: '/unauthorized',
        name: 'unauthorized',
        component: () => import('@/views/result/403.vue')
      }
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
  else next()
})

export default router
