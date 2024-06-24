<script setup lang="ts">
  interface Props {
    isVideo: Boolean,
    contentSrc: string,
    contentType: string,
  }

  const props = defineProps<Props>()

  console.log(props)

</script>

<template>
  <section class='aspect-video pointer-events-none'>
    <video
      v-if="props.isVideo"
      autoplay
      loop
      muted
      playsinline
    >
      <source :src="props.contentSrc" :type="props.contentType">
    </video>
    <img v-else :src="props.contentSrc">
  </section>
</template>
