<script setup lang="ts">
  import Modal from '@components/Modal.vue';
  import Clickable from '@components/Clickable.vue';

  interface Props {
    message: string,
    show: boolean,
    data?: any,
    customisation?: {
      oktext?: string,
      canceltext?: string,
      centerMessage?: boolean,
    }
  }
  const props = defineProps<Props>()
  const $emit = defineEmits(['close-ok', 'close-cancel'])

</script>

<template>
  <Modal
    :id="`confirmation-dialog`"
    :show="props.show"
    class="scrollbar overflow-hidden !h-[300px] !w-[500px] !absolute !inset-y-1/2 !mx-auto"
    @click.stop
  >
    <section class="flex flex-col w-full h-full p-10 justify-between">
      <div><p :class="{ 'text-center' : props?.customisation?.centerMessage }">{{ props.message }}</p></div>
      <slot :content="props.data"></slot>
      <div class="inline-flex justify-around">
        <Clickable><button @click="$emit('close-ok', props.data)" class="px-4 py-2 glass-sm rounded-md">{{ props.customisation?.oktext ? props.customisation.oktext : 'Ok'}}</button></Clickable>
        <Clickable><button @click="$emit('close-cancel')"  class="px-4 py-2 glass-sm rounded-md">{{ props.customisation?.canceltext ? props.customisation.canceltext : 'Cancel'}}</button></Clickable>
      </div>
    </section>
  </Modal>
</template>
