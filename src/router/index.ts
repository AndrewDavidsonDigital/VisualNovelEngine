import { createRouter, createWebHistory } from 'vue-router'
import Init from '@views/Init.vue'
import NewGame from '@views/functions/NewGame.vue'
import Exit from '@views/functions/Exit.vue'
import Landing from '@views/menus/Landing.vue'
import Options from '@views/menus/Options.vue'
import ScenePlayer from '@views/ScenePlayer.vue'

import { useCustomCursor } from '@stores/customCursor';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'init',
      component: Init
    },
    {
      path: '/game',
      name: 'game',
      component: ScenePlayer
    },
    {
      path: '/new-game',
      name: 'newGame',
      component: NewGame,
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


router.beforeEach((to, from, next) => {
  const cc = useCustomCursor();
  cc.clear();
  next();
})

export default router;
