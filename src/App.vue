
<script setup lang="ts">
  import { onMounted } from 'vue'
  import { RouterView } from 'vue-router'
  import { useConfiguration } from '@stores/configuration';
  import { useScriptEngine } from '@stores/scriptEngine';
  import { useCustomCursor } from '@stores/customCursor';
  import gameChapters from '@assets/game.chapters.json';
  import Cursor from './Cursor.vue';
  import { 
    useBgmEngine, 
    useSfxEngine,
    useVoiceEngine,
    useInteractionEngine,
  } from '&audio'

  const bgmEngine = useBgmEngine();
  const sfxEngine = useSfxEngine();
  const voiceEngine = useVoiceEngine();
  const interactionEngine = useInteractionEngine();

  const config = useConfiguration();
  const scriptEngine = useScriptEngine();
  const customCursor = useCustomCursor();

  onMounted(() => {
    config.init();

    bgmEngine.init('_audio_bgm');
    bgmEngine.setVolume(config.audio.bgm);
    bgmEngine.setTrack('/audio/bgm/bgm.m4a');
    
    sfxEngine.init('_audio_sfx');
    sfxEngine.setVolume(config.audio.sfx);
    interactionEngine.init('_audio_interaction');
    interactionEngine.setVolume(config.audio.sfx);
    voiceEngine.init('_audio_voice');
    voiceEngine.setVolume(config.audio.voice);

    scriptEngine.init(gameChapters);

    const cursorEl = document.getElementById('cursor') as HTMLDivElement;
    customCursor.init(cursorEl);

    document.addEventListener('mousemove', (e: MouseEvent) => {
      const cursorEl = document.getElementById('cursor') as HTMLDivElement;
      const curX = e.clientX - cursorEl.offsetWidth / 2;
      const curY = e.clientY - cursorEl.offsetHeight / 2;

      cursorEl.style.left = `${curX}px`
      cursorEl.style.top = `${curY}px`
    });

    document.addEventListener('click', (e: MouseEvent) => {
      interactionEngine.setAndPlay('/audio/sfx/click_2.wav');
    });

    document.addEventListener('inner-click', (e: any) => {
      interactionEngine.setAndPlay('/audio/sfx/click_2.wav');
    });

  });


</script>

<template>
  <audio id="_audio_bgm" class="pointer-events-none" playsinline autoplay loop></audio>
  <audio id="_audio_sfx" class="pointer-events-none" playsinline autoplay></audio>
  <audio id="_audio_interaction" class="pointer-events-none" playsinline autoplay></audio>
  <audio id="_audio_voice" class="pointer-events-none" playsinline autoplay></audio>
  <main class="w-screen h-screen overflow-hidden bg-black">
    <RouterView class="w-full h-full flex flex-col justify-center items-center *:screen-1920p" />
  </main>
  <Cursor />
</template>