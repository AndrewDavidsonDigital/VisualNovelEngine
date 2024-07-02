<script setup lang="ts">
  import { useCustomCursor } from '@stores/customCursor';
  const customCursor = useCustomCursor();

</script>

<template>
  <span
    @mouseenter="customCursor.updateTo('pointer')"
    @mouseleave="customCursor.clear()"
  ><slot></slot></span>
</template>
