<script setup lang="ts">
  import Clickable from '@components/Clickable.vue';
  import { useStorage } from '@lib/storage';

  interface ISave {
    title: string,
    chapterIndex: number | string,
    sceneIndex: number | string,
    transitionIndex: number | string,
    active?: boolean,
    dateTime: number,
  }

  const stateStorage = useStorage();

  const storageConfig = JSON.parse((stateStorage.get() || '')) as ISave[];
  // get newest save, based on active AND 
  const hasSaves = (storageConfig
    .filter(save => save.active)
  ).length > 0;  
  
</script>

<template>
  <nav class="flex flex-col gap-5 interactable-styling">
    <Clickable><RouterLink to="/new-game" >New Game</RouterLink></Clickable>
    <Clickable v-if="hasSaves"><RouterLink to="/continue" >Continue</RouterLink></Clickable>
    <span v-else><a class="italic">Continue</a></span>
    <Clickable v-if="hasSaves"><RouterLink to="/menu">Load Game</RouterLink></Clickable>
    <span v-else><a class="italic">NYI: Load Game</a></span>
    <Clickable><RouterLink to="/options" >Options</RouterLink></Clickable>
    <Clickable><RouterLink to="/exit" >Exit</RouterLink></Clickable>
  </nav>
</template>

<style scoped>
  .interactable-styling{
    > * > * {
      &:focus-visible, &:hover {
        @apply text-orange-400;
      }
      &:focus-visible, &:focus {
        @apply !outline-none;
      }
    }
  }
</style>