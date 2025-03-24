
<script setup lang="ts">
  import { onMounted } from 'vue'
  import { RouterView } from 'vue-router'
  import { useConfiguration } from '@stores/configuration';
  import { useScriptEngine } from '@stores/scriptEngine';
  import gameChapters from '@assets/game.chapters.json';
  import Cursor from './Cursor.vue';
  import AudioEngine from './AudioEngine.vue';
  import { useInteractionEngine } from '@stores/audio';

  const config = useConfiguration();
  const scriptEngine = useScriptEngine();

  const interactionEngine = useInteractionEngine();
  
  onMounted(() => {
    config.init();
    scriptEngine.init(gameChapters);

    document.addEventListener('click', (_e: MouseEvent) => {
      interactionEngine.setAndPlay('/audio/sfx/click_2.wav');
    });

    document.addEventListener('inner-click', (_e: any) => {
      interactionEngine.setAndPlay('/audio/sfx/click_2.wav');
    });

  });


</script>

<template>
  <AudioEngine />
  <main class="h-screen overflow-hidden bg-black hidden sm:block">
    <RouterView class="w-full h-full flex flex-col justify-center items-center *:screen-1920p" />
  </main>
  <main class="sm:hidden h-screen flex flex-col justify-center items-center">
    <h1 class="">Engine does not currently support rendering at this size</h1>
  </main>
  <Cursor />
</template>