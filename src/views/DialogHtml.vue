<script setup>
import { onMounted,  onUnmounted,  ref } from 'vue'  

// reactive state
let modalRef = ref(null)

const duration = 1000;

const toggleDialog = (toOpen = false) => {
  if (toOpen){
    modalRef.value.showModal();
  } else {
    modalRef.value.close();
  }
}

onMounted(() => {
  document.body.classList.add('tw-overflow-x-hidden');
});

onUnmounted(() => {
  document.body.classList.remove('tw-overflow-x-hidden');
});

</script>
  
<template>
  <section class="tw-text-white tw-text-left tw-w-1/2 tw-pb-5" style="background: #181818;">
    <h2 class="tw-text-xl tw-text-orange-300">Issue: </h2>
    <p class="tw-indent-5">Can the html dialog be used for Flyouts</p>
    <h2 class="tw-text-xl tw-text-orange-300">Details: </h2>
    <p class="tw-indent-5">Need to consider how to use the html Dialog tag, and see if its compatable with the concept of a flyout</p>
  </section>
  <section class="tw-flex tw-flex-col tw-gap-y-2 tw-text-white tw-pb-5">
    <button @click="toggleDialog">Open Modal</button>
    <button @click="toggleFlyoutFromRight">Open Flyout from Right</button>
  </section>
  <dialog 
    ref="modalRef"
    class="
      tw-m-auto
      backdrop:tw-bg-red-500/30
      tw-transition-all tw-duration-1000
    ">
    <div class="tw-flex tw-items-center tw-justify-center">
      <button @click="toggleDialog(false)">Close</button>
    </div>
  </dialog>
</template>

<style scoped scss>
/* 
  .tw-duration-custom{
    @apply tw-duration-[v-bind(duration)];
  }
   */
</style>