<script setup lang="ts">
  import { IChar } from '@stores/interfaces';
  import { computed } from 'vue';

  interface Props {
    characters: IChar[],
  }
  const props = defineProps<Props>()


  const instantiationDate = Date.now();

  const charCount = computed(() => {
    return props.characters.length;
  })

</script>
<template>
  <section data-layer="characters" class="z-10 h-full overflow-hidden">
    <section class="grid dynamic-grid h-full translate-y-1/3">
      <template v-for="(char, index) in props.characters" :key="`char_${index}__${instantiationDate}`">
        <div class="h-full flex items-end justify-center overflow-hidden" :style="`grid-column-start: ${index + 2}`">
          <img :src="char.path" class="max-h-full w-auto object-contain" alt="">
        </div>
      </template>
    </section>
  </section>
</template>

<style scoped>
  .dynamic-grid {
    grid-template-columns: 15% repeat( v-bind('charCount'), 1fr) 15%;
  }
</style>