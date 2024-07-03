<script setup lang="ts">
  import { useCustomCursor } from '@stores/customCursor';
  const customCursor = useCustomCursor();

  interface Props {
    inline?: boolean,
  }
  const props = defineProps( {
    inline: {
      type: Boolean,
      default: true,
    },
  }) as Props;
</script>

<template>
  <div v-if="!(props.inline)"
    @mouseenter="customCursor.updateTo('pointer')"
    @mouseleave="customCursor.clear()"
  ><slot></slot></div>
  <span v-else
    @mouseenter="customCursor.updateTo('pointer')"
    @mouseleave="customCursor.clear()"
  ><slot></slot></span>
</template>
