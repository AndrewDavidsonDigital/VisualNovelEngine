<script setup lang="ts">
  import WrapperLink from '@components/WrapperLink.vue';
</script>

<template>
  <nav class="flex flex-col gap-5">
    <WrapperLink destination="/" class="hover:text-orange-400">Restart</WrapperLink>
    <WrapperLink destination="/new-game" class="hover:text-orange-400">New Game</WrapperLink>
    <WrapperLink destination="/continue" class="hover:text-orange-400">Continue</WrapperLink>
    <WrapperLink destination="/load" class="hover:text-orange-400">Load Game</WrapperLink>
    <WrapperLink destination="/options" class="hover:text-orange-400">Options</WrapperLink>
    <WrapperLink destination="/exit" class="hover:text-orange-400">Exit</WrapperLink>
  </nav>
</template>
