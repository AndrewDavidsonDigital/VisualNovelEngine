<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Modal from '@components/Modal.vue';
  import Clickable from '@components/Clickable.vue';

  interface Props {
    message: string,
    show: boolean,
    data?: any,
    customisation?: {
      oktext?: string,
      canceltext?: string,
      labelText?: string,
    }
  }
  const props = defineProps<Props>()
  const $emit = defineEmits(['close-ok', 'close-cancel'])

  const inputValue = ref<string>('');

  watch(
    () => props.show,
    () => {
      inputValue.value = '';
    }
  )

</script>

<template>
  <Modal
    :id="`confirmation-dialog`"
    :show="props.show"
    class="scrollbar overflow-hidden !h-[300px] !w-[500px] !absolute !inset-y-1/2 !mx-auto"
    @click.stop
  >
    <section class="flex flex-col w-full h-full p-10 justify-between">
      <div>
        <p>{{ props.message }}</p>
        <label for="input_dialog_textArea"></label>{{props.customisation?.labelText ? props.customisation.labelText : 'TextArea'}}
        <br>
        <textarea id="input_dialog_textArea" v-model="inputValue" class="w-full rounded-lg text-slate-700 px-3 py-1 min-h-8 h-8 focus:italic outline-none"></textarea>
      </div>
      <div class="inline-flex justify-around">
        <Clickable><button @click="$emit('close-ok', {...props.data, input: inputValue })" class="px-4 py-2 glass-sm rounded-md">{{ props.customisation?.oktext ? props.customisation.oktext : 'Ok'}}</button></Clickable>
        <Clickable><button @click="$emit('close-cancel')"  class="px-4 py-2 glass-sm rounded-md">{{ props.customisation?.canceltext ? props.customisation.canceltext : 'Cancel'}}</button></Clickable>
      </div>
    </section>
  </Modal>
</template>
