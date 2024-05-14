<!-- eslint-disable prettier/prettier -->
<script setup>
import { ref } from 'vue'


// reactive state
let borderToggle = ref(true)

</script>

<template>
  <section class="tw-text-white tw-text-left tw-w-1/2 tw-pb-5">
    <h2 class="tw-text-xl">Problem: </h2>
    <p class="tw-indent-5">Need to consider how we can get oddly styled border via images</p>
    <h2 class="tw-text-xl">Details: </h2>
    <p class="tw-indent-5">Need a solution for sausage styled </p>
    <h2 class="tw-text-xl">Logic: </h2>
    <p class="tw-indent-5">TBD</p>
  </section>
  <section class="tw-flex tw-gap-x-2 tw-text-black tw-pb-5">
    <button
      class="tw-px-2 tw-bg-slate-400 tw-rounded-md" 
      @click="(e) => borderToggle = !borderToggle">Change {{ borderToggle ? 'to Dashed' : 'to custom' }}</button>
  </section>
  <section>
    <div :class="[
      'tw-h-10 tw-w-40',
      {'tw-border-[4px] tw-border-solid tw-border-sausage' : borderToggle},
      {'tw-border-[4px] tw-border-dashed tw-border-red-600' : !borderToggle},
      'tw-bg-slate-400',
    ]"></div>
  </section>
</template>

<style scoped scss>
  .tw-border-sausage{
    --var-border-size: 3px;
    --var-border-slice: 1;
    border-image: url('../assets/bg.svg') var(--var-border-slice) / var(--var-border-size) / calc(var(--var-border-size) / 2) space;
  }
</style>

