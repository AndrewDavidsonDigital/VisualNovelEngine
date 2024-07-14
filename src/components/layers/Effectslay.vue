<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';


  type EffectType = 'warning' | 'good-bad';

  interface Props {
    effect: EffectType;
    toggledOn?: {
      type: Boolean;
      default: false;
    },
    dataAttributes?: string[];
  }
  const props = defineProps<Props>()

  
  const layerRef = ref<HTMLDivElement>()

  function resetDataAttributes(){
    if (props.dataAttributes && props.dataAttributes?.length > 0){
      props.dataAttributes.forEach(attr => {
        layerRef.value?.setAttribute(`data-${attr}`, '');
      });
    }
  }


  watch(() => props.dataAttributes, () => {
    resetDataAttributes();
  })

  onMounted(() => {
    resetDataAttributes();
  })

</script>

<template>
  <div class="z-10 *:size-full" ref="layerRef">
    <section 
      v-if="props.effect === 'warning'"
      class="animate-effectWarning"
    ></section>
    <section 
      v-else-if="props.effect === 'good-bad'"
      class='flex'
    >
      <section 
        :class="[
          'effects-grid w-1/2 relative opacity-0',
          { 'leftAnimated': props.effect === 'good-bad'},
        ]"
        style="--shadowColour:white"
      >
        <div class="h-0 w-full effect-shadow"></div>
        <div class="h-full w-0 effect-shadow"></div>
        <div class="h-0 w-full effect-shadow absolute -bottom-0"></div>
      </section>
      <section
        :class="[
          'effects-grid w-1/2 relative opacity-0',
          { 'rightAnimated': props.effect === 'good-bad'},
        ]"
        style="--shadowColour:black"
      >
        <div class="h-0 w-full effect-shadow"></div>
        <div class="h-full w-0 effect-shadow absolute -right-0"></div>
        <div class="h-0 w-full effect-shadow absolute -bottom-0"></div>
      </section>
    </section>
  </div>
</template>

<style scoped>

  .effects-grid {
    @apply grid [grid-template-areas:_"effects"] *:[grid-area:_effects];
  }

  .effect-shadow {
    box-shadow: 0 0 30px 30px var(--shadowColour);
  }

  [data-animateLeft] > section > section.leftAnimated {
    @apply animate-effectGoodBad;
  }

  [data-animateRight] > section > section.rightAnimated {
    @apply animate-effectGoodBad;
  }
</style>