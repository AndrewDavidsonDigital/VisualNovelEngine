<script setup lang="ts">
  import Clickable from '@components/Clickable.vue';
  import { useBgmEngine } from '@stores/audio/bgmEngine'
  import { useConfiguration } from '@stores/configuration';
  

  const BgmEngine = useBgmEngine();
  BgmEngine.stop();

  
  const config = useConfiguration()
  config.save();

</script>

<template>
  <section><Clickable><RouterLink to="/menu">Go Back</RouterLink></Clickable></section>
</template>

