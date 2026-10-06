//router con lazy-loading de las vistas, para que se carguen solo cuando se accede a ellas, mejorando el rendimiento de la app.

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },

  {
    path: '/operations',
    name: 'operations',
    component: () => import('../views/OperationsView.vue')
  },

  {
    path: '/intelligence',
    name: 'intelligence',
    component: () => import('../views/IntelligenceView.vue')
  },

  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('../views/AnalyticsView.vue')
  },

  {
    path: '/map',
    name: 'map',
    component: () => import('../views/MapView.vue')
  },

   {
    path: '/room',
    name: 'room',
    component: () => import('../views/Room.vue')
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router