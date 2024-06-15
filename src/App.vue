
<script setup lang="ts">
  import { onMounted } from 'vue'
  import { RouterView } from 'vue-router'
  import { useConfiguration } from '@stores/configuration';
  import { 
    useBgmEngine, 
    useSfxEngine,
    useVoiceEngine,
  } from '&audio'


  const bgmEngine = useBgmEngine()
  const sfxEngine = useSfxEngine()
  const voiceEngine = useVoiceEngine()
  const config = useConfiguration()

  onMounted(() => {
    config.init();

    bgmEngine.init('_audio_bgm');
    bgmEngine.setVolume(config.audio.bgm);
    bgmEngine.setTrack('/audio/bgm/bgm.m4a');
    
    sfxEngine.init('_audio_sfx');
    sfxEngine.setVolume(config.audio.sfx);
    voiceEngine.init('_audio_voice');
    voiceEngine.setVolume(config.audio.voice);
  });

</script>

<template>
  <audio id="_audio_bgm" class="pointer-events-none" playsinline autoplay loop></audio>
  <audio id="_audio_sfx" class="pointer-events-none" playsinline autoplay></audio>
  <audio id="_audio_voice" class="pointer-events-none" playsinline autoplay></audio>
  <main class="w-screen h-screen overflow-hidden bg-black">
    <RouterView class="w-full h-full flex flex-col justify-center items-center *:max-w-1920p *.aspect-16/9" />
  </main>
</template>
