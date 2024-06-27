<script setup lang="ts">
  import Navigation from '@components/Navigation.vue';
  import videoSrc from '@assets/video/bg-audio.mp4';
  import { useSfxEngine } from '&audio'


  const sfxEngine = useSfxEngine();

  function playSfx(){
    sfxEngine.setTrack('/audio/sfx/ayaya.wav');
    sfxEngine.play();
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
        <button @click="playSfx()" class="px-4 py-2 bg-white text-black rounded h-fit">AYAYA?</button>
        <div> foo bar baz</div>
      </section>
    </div>
  </div>
</template>

