<script setup lang="ts">
  interface Props {
    isVideo: Boolean,
    contentSrc: string,
    contentType: string,
  }

  const props = defineProps<Props>()

  import { trace } from '@lib/logging';
  trace(JSON.stringify(props));

</script>

<template>
  <section class="aspect-video pointer-events-none min-w-[min(100vw,1920px)]">
    <Transition>
      <video
        v-if="props.isVideo"
        autoplay
        loop
        muted
        playsinline
        class="fixed"
      >
        <source :src="props.contentSrc" :type="props.contentType">
      </video>
      <img 
        v-else 
        :src="props.contentSrc" 
        class="fixed max-w-[min(100vw,1920px)]"
      >
    </Transition>
  </section>
</template>
<style scoped>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 1s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>