<script setup lang="ts">
  import { trace } from '@lib/logging';
  import { innerInteractionEvent } from '@lib/interactions';
  import { ref, watch } from 'vue';

  const LOGGING_PREFIX = '▫️Modal:\t';

  interface Props {
    id: string,
    show: boolean,
  }
  const props = defineProps<Props>()
  const $emit = defineEmits(['open', 'close'])


  const dialogRef = ref<HTMLDialogElement>()


  watch(() => props.show, (newValue) => {
    if(newValue){
      dialogRef.value?.show();
      dialogRef.value?.blur();
      $emit('open');
    } else {
      trace(`${LOGGING_PREFIX}closing modal`);
      dialogRef.value?.close()
      $emit('close');
    }
  })

  function checkBackdropClick(event: MouseEvent ){
    innerInteractionEvent(event);
    const target = event.target as HTMLElement;
    const bounds = target.getBoundingClientRect()
    const click = {
      x: event.clientX,
      y: event.clientY,
    }

    if (!(bounds.left < click.x  && click.x < bounds.right
      && bounds.top < click.y  && click.y < bounds.bottom
    )){
      dialogRef.value?.close();
    }
  }

</script>

<template>
  <dialog
    :id="props.id"
    ref="dialogRef"
    class="
      max-w-[calc(1920px*0.95)] w-[97vw] place-self-center mx-5
      backdrop-blur-[5px] !outline-none

      relative

      backdrop:bg-slate-800/30
      bg-slate-800/90 rounded-xl
      transition-all duration-1000
      aspect-16/9
      self-center
      z-dialog

      hidden
      opacity-0

      [transition-behavior:_allow-discrete]
      backdrop:[transition-behavior:_allow-discrete]
      "
      @click="(e) => checkBackdropClick(e)"
      role="presentation"
    >
    <slot ></slot>
  </dialog>
</template>

<style scoped>
  dialog[open]{
    @apply block;
    @apply opacity-100;

    @starting-style {
      opacity: 0;
    }
  }

  dialog[open]::backdrop{
    @apply opacity-30;
  }

  @starting-style {
    dialog[open]::backdrop{
      @apply opacity-0;
    }
  }
</style>