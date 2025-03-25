<script setup lang="ts">
  import Clickable from '@components/Clickable.vue';
</script>

<template>
  <nav class="flex flex-col gap-5 interactable-styling">
    <Clickable><RouterLink to="/new-game" >New Game</RouterLink></Clickable>
    <Clickable><RouterLink to="/continue" >Continue</RouterLink></Clickable>
    <Clickable><RouterLink to="/menu"  @click.prevent>NYI: Load Game</RouterLink></Clickable>
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