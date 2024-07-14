<script setup lang="ts">
  import { IChar } from '@stores/interfaces';


  interface Props {
    characters: IChar[],
  }
  const props = defineProps<Props>()

</script>

<template>
  <section class="z-10">
    <template v-for="char in props.characters">
      <img :src="char.path" class="max-h-[200px]">
    </template>
  </section>
</template>