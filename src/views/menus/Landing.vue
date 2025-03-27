<script setup lang="ts">
  import { onMounted } from 'vue'
  import Navigation from '@components/Navigation.vue';
  import videoSrc from '@assets/video/bg-menu.mp4';
  import Clickable from '@components/Clickable.vue';
  import { useCurrentGame } from '@lib/storage';
  import { 
    useBgmEngine, 
  } from '&audio'
  import router from '../../router';
  import Versioning from '../../Versioning.vue';
  import { useScriptEngine } from '@stores/scriptEngine';
  
  const scriptEngine = useScriptEngine();
  const currentGame = useCurrentGame();
  const bgmEngine = useBgmEngine();
  const preserveAudioRoutes = ['/', '/options']

  const firstStart = preserveAudioRoutes.indexOf(router.currentRoute.value.meta?.previousPath as string) !== -1 || false;

  onMounted(() => {
    currentGame.clear();
    scriptEngine.reset();
    if (!firstStart){
      bgmEngine.setTrack('/audio/bgm/bgm.m4a');
    }
  });
</script>

<template>
  <div class="animate-fadeIn">
    <div class='grid [grid-template-areas:_"stack"] *:[grid-area:_stack]'>
      <section class='aspect-video pointer-events-none'>
        <video
          autoplay
          loop
          muted
          playsinline
        >
          <source :src="videoSrc" type="video/mp4">
        </video>
      </section>
      <section class='flex justify-between px-8 py-4 aspect-video z-10'>
        <Navigation />
        <Clickable class="interactable-styling"><RouterLink to="/" class="hover:text-orange-400">Restart</RouterLink></Clickable>
      </section>
      <Versioning />
    </div>
  </div>
</template>



<style scoped>
  .interactable-styling{
     > * {
      &:focus-visible, &:hover {
        @apply text-orange-400;
      }
      &:focus-visible, &:focus {
        @apply !outline-none;
      }
    }
  }
</style>