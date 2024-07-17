<script setup lang="ts">
  import Clickable from '@components/Clickable.vue';
</script>

<template>
  <nav class="flex flex-col gap-5">
    <Clickable><RouterLink to="/new-game" class="hover:text-orange-400">New Game</RouterLink></Clickable>
    <Clickable><RouterLink to="/continue" class="hover:text-orange-400">Continue</RouterLink></Clickable>
    <Clickable><RouterLink to="/load" class="hover:text-orange-400">Load Game</RouterLink></Clickable>
    <Clickable><RouterLink to="/options" class="hover:text-orange-400">Options</RouterLink></Clickable>
    <Clickable><RouterLink to="/exit" class="hover:text-orange-400">Exit</RouterLink></Clickable>
  </nav>
</template>
