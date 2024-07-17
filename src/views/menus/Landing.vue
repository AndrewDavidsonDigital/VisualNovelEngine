<script setup lang="ts">
  import Navigation from '@components/Navigation.vue';
  import videoSrc from '@assets/video/bg-menu.mp4';
  import { useSfxEngine } from '&audio'
  import { useCustomCursor } from '@stores/customCursor';
  import Clickable from '@components/Clickable.vue';


  const sfxEngine = useSfxEngine();
  const customCursor = useCustomCursor();

  function playSfx(){
    sfxEngine.setAndPlay('/audio/sfx/ayaya.wav');
  }

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
        <button 
          class="px-4 py-2 bg-white text-black rounded h-fit" 
          @mouseenter="customCursor.updateTo('pointer')"
          @mouseleave="customCursor.clear()"
          @click="playSfx()"
        >AYAYA?</button>
        <Clickable><RouterLink to="/" class="hover:text-orange-400">Restart</RouterLink></Clickable>
      </section>
    </div>
  </div>
</template>

