<script setup lang="ts">
import { ref, watch } from 'vue';

  interface Props {
    id: string,
    show: boolean,
  }
  const props = defineProps<Props>()

  const dialogRef = ref<HTMLDialogElement>()


  watch(() => props.show, (newValue) => {
    if(newValue){
      dialogRef.value?.showModal();
      dialogRef.value?.blur();
    } else {
      dialogRef.value?.close()
    }
  })

  function checkBackdropClick(event: MouseEvent ){
    const target = event.target as HTMLElement;
    const bounds = target.getBoundingClientRect()
    const click = {
      x: event.clientX,
      y: event.clientY,
    }

    if (!(bounds.left < click.x  && click.x < bounds.right
      && bounds.top < click.y  && click.y < bounds.bottom
    )){
      console.log('I am Outsied');
      dialogRef.value?.close();
    }
  }

</script>

<template>
  <dialog
    :id="props.id"
    ref="dialogRef"
    class="
      backdrop:bg-slate-800/30
      bg-slate-800/90 rounded-xl
      transition-all duration-1000
      aspect-16/9 w-[90vw]
      self-center
      z-dialog"
      @click="(e) => checkBackdropClick(e)"
    >
    <slot ></slot>
  </dialog>
</template>
