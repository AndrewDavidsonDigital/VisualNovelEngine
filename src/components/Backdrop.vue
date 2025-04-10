<script setup lang="ts">
  import { trace } from '@lib/logging';
  import { computed, ref, watch } from 'vue';
  interface Props {
    isVideo: Boolean,
    contentSrc: string,
    contentType: string,
  }

  const props = defineProps<Props>()

  type VideoReference = "videoA" | "videoB";
  const nextVideoReference = ref<VideoReference>("videoA");
  const videoData = ref({
    videoA: {
      src: props.contentSrc,
    },
    videoB: {
      src: props.contentSrc,
    },
  });

  const computeVideoData = computed(() => {
    if (props.isVideo) {
      return props.contentSrc;
    }
    return null;
  });

  watch(computeVideoData, (newVal) => {
    if (newVal) {
      trace('Backdrop: ' + newVal);
      videoData.value[nextVideoReference.value].src = newVal;
      nextVideoReference.value = nextVideoReference.value === "videoA" ? "videoB" : "videoA";
    }
  });


  trace('Backdrop: ' + JSON.stringify(props));

</script>

<template>
  <section 
    class='aspect-video pointer-events-none w-fit grid grid-stack'
    data-layer="backdrop"
  >
    <Transition>
      <div v-if="props.isVideo" class="grid grid-stack">
        <Transition>
          <video
            v-if="nextVideoReference === 'videoB'"
            id="video-a"
            key="`${videoData.videoA.src}-video-a`"
            autoplay
            loop
            muted
            playsinline
            class="w-full aspect-video"
            :src="videoData.videoA.src"
            role="presentation"
            tabindex="-1"
          ></video>
          <video
            v-else-if="nextVideoReference === 'videoA'"
            id="video-b"
            key="`${videoData.videoB.src}-video-b`"
            autoplay
            loop
            muted
            playsinline
            class="w-full aspect-video"
            :src="videoData.videoB.src"
            role="presentation"
            tabindex="-1"
            ></video>
        </Transition>
      </div>
      <img 
        v-else 
        alt=""
        :src="props.contentSrc" 
        class="max-w-[min(100%,1920px)]"
        key="`${props.contentSrc}-image`"
        role="presentation"
        tabindex="-1"
      >
    </Transition>
  </section>
</template>
<style scoped>
  .grid-stack {
    @apply [grid-template-areas:_"stack"] *:[grid-area:_stack];
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 1s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>