
<script setup lang="ts">
  import { useConfiguration } from '@stores/configuration';
  import { onMounted } from 'vue';
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

  onMounted(() => {

    bgmEngine.init('_audio_bgm');
    bgmEngine.setVolume(config.audio.bgm);
    bgmEngine.setTrack('/audio/bgm/bgm.m4a');
    
    sfxEngine.init('_audio_sfx');
    sfxEngine.setVolume(config.audio.sfx);
    interactionEngine.init('_audio_interaction');
    interactionEngine.setVolume(config.audio.sfx);
    voiceEngine.init('_audio_voice');
    voiceEngine.setVolume(config.audio.voice);

  });

</script>

<template>
  <audio id="_audio_bgm" class="pointer-events-none" playsinline autoplay loop></audio>
  <audio id="_audio_sfx" class="pointer-events-none" playsinline autoplay></audio>
  <audio id="_audio_interaction" class="pointer-events-none" playsinline autoplay></audio>
  <audio id="_audio_voice" class="pointer-events-none" playsinline autoplay></audio>
</template>
