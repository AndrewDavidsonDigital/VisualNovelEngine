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
    role="presentation"
    @mouseenter="customCursor._updateType('pointer')"
    @focus="customCursor._updateType('pointer')"
    @mouseleave="customCursor.clear()"
    @blur="customCursor.clear()"
    class="[&>*]:transition-colors [&>*]:duration-200"
  ><slot></slot></div>
  <span v-else
    role="presentation"
    @mouseenter="customCursor._updateType('pointer')"
    @focus="customCursor._updateType('pointer')"
    @mouseleave="customCursor.clear()"
    @blur="customCursor.clear()"
    class="[&>*]:transition-colors [&>*]:duration-200"
  ><slot></slot></span>
</template>
