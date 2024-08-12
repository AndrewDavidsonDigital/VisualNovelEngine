<script setup lang="ts">
  import { onMounted } from 'vue'
  import Navigation from '@components/Navigation.vue';
  import videoSrc from '@assets/video/bg-menu.mp4';
  import Clickable from '@components/Clickable.vue';
  import { useCurrentGame } from '@lib/storage';

  const currentGame = useCurrentGame();

  onMounted(() => {
    currentGame.clear();
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
        <Clickable><RouterLink to="/" class="hover:text-orange-400">Restart</RouterLink></Clickable>
      </section>
    </div>
  </div>
</template>

