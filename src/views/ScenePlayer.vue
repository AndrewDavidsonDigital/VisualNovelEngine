<script setup lang="ts">
  import videoSrc from '@assets/bg-audio.mp4';
  import Backdrop from '@components/Backdrop.vue';

</script>

<template>
  <div class="animate-fadeIn">
    <div class='grid [grid-template-areas:_"stack"] *:[grid-area:_stack]'>
      <!-- Backdrop -->
       <Backdrop
        :isVideo="true"
        :contentSrc="videoSrc"
        contentType="video/mp4"
      />
      <!-- Interactions / char layer -->
       <section>foooo</section>
      <!-- Overlay -->
       <section>baaaaar</section>
    </div>
  </div>
</template>

