<script setup lang="ts">
  import Clickable from '@components/Clickable.vue';
  import { useBgmEngine } from '@stores/audio/bgmEngine'
  import { useConfiguration } from '@stores/configuration';
  

  const BgmEngine = useBgmEngine();
  BgmEngine.stop();

  
  const config = useConfiguration()
  config.save();

  function handleCloseTab(){
    const shouldExist = window.confirm('Are you sure you wan\'t to quite?');
    if (shouldExist){
      window.location = 'https://google.com' as  (string & Location);
    }
  }

</script>

<template>
  <section>
    <div class="flex flex-col">
      <Clickable><RouterLink to="/menu">Go Back</RouterLink></Clickable>
      <Clickable><div @click="handleCloseTab()" class="cursor-pointer">Close Tab</div></Clickable>
    </div>
  </section>
</template>

