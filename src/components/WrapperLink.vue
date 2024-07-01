<script setup lang="ts">
  import { useCustomCursor } from '@stores/customCursor';

  const customCursor = useCustomCursor();

  interface Props {
    destination: string,
  }
  const props = defineProps<Props>()


</script>

<template>
  <RouterLink 
    :to="props.destination" 
    @mouseenter="customCursor.updateTo('pointer')"
    @mouseleave="customCursor.clear()"
  ><slot></slot></RouterLink>
</template>
