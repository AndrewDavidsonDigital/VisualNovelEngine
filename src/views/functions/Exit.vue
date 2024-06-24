<script setup lang="ts">
  import { useBgmEngine } from '@stores/audio/bgmEngine'
  import { useConfiguration } from '@stores/configuration';

  const BgmEngine = useBgmEngine();
  BgmEngine.stop();

  
  const config = useConfiguration()
  config.save();

</script>

<template>
  <section><RouterLink to="/menu">Go Back</RouterLink></section>
</template>

