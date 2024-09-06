<script setup lang="ts">
  import { IChar } from '@stores/interfaces';


  interface Props {
    characters: IChar[],
  }
  const props = defineProps<Props>()

  const instantiationDate = Date.now();

</script>

<template>
  <section class="z-10">
    <template v-for="(char, index) in props.characters" :key="`char_${index}__${instantiationDate}`">
      <img :src="char.path" class="max-h-[200px]">
    </template>
  </section>
</template>