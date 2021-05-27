import { createRouter, createWebHistory } from 'vue-router'

import Layouts from '../layouts/index.vue'

const routes = [
    {
        path: "/login",
        name: "Login",
        component: () => import('../views/login/index.vue'),
    },
    {
        path: "/",
        component: Layouts,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('../views/dashboard/index.vue'),
                name: 'Dashboard',
                meta: { title: 'Dashboard' }
            }
        ]
    },
    {
        path: "/",
        component: Layouts,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('../views/dashboard/index.vue'),
                name: 'Dashboard',
                meta: { title: 'Dashboard' }
            }
        ]
    }
]

const router = new createRouter({
    history: createWebHistory(),
    routes
})

export default router;
