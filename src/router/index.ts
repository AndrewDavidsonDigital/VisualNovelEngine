import { createRouter, createWebHistory } from 'vue-router'
import Init from '../views/Init.vue'
import Landing from '../views/menus/Landing.vue'
import Options from '../views/menus/Options.vue'
import Exit from '../views/functions/Exit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'init',
      component: Init
    },
    {
      path: '/menu',
      name: 'landing',
      component: Landing
    },
    {
      path: '/options',
      name: 'options',
      component: Options
    },
    {
      path: '/exit',
      name: 'exit',
      component: Exit
    },
  ]
});

export default router;
