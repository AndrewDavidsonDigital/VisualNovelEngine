<script setup lang="ts">
  import { ref } from 'vue';

  interface Props {
    text: string,
    speaker: string | null,
    trigger: boolean,
  }

  const props = defineProps<Props>()

  const isAuto = ref(false);
  const isViewBackdrop = ref(false);

  function autoToggle(){
    isAuto.value = !isAuto.value;
  }
  function skipToggle(){
    console.log('Skipping');
  }
  function viewBackdropToggle(){
    isViewBackdrop.value = !isViewBackdrop.value;
  }

</script>

<template>
  <section class='flex flex-col justify-between px-8 py-4 aspect-video z-10'>
    <div class='flex justify-between px-8 py-4'>
      <section>
        <button 
          v-show="!isViewBackdrop"
          @click.stop="skipToggle()"
          class="px-4 py-2 bg-white text-black rounded h-fit" >Skip</button>
      </section>
      <section class='flex justify-between px-8 py-4'>
        <button 
          v-show="!isViewBackdrop"
          @click.stop="autoToggle()"
          class="px-4 py-2 bg-white text-black rounded h-fit" >{{isAuto ? 'Auto' : 'Pause'}}</button>
        <button 
          @click.stop="viewBackdropToggle()" 
          class="px-4 py-2 bg-white text-black rounded h-fit">{{isViewBackdrop ? 'show' : 'hide'}}</button>
      </section>
    </div>
    <div v-show="!isViewBackdrop" class="min-h-[20%]">
      <section class='flex flex-col items-center px-8 py-4 h-full bg-slate-600/50 rounded-2xl'>
        <h3 class="text-3xl min-h-8 transition-all text-orange-400">{{props.speaker}}</h3>
        <p>
          <span :class="[
            'inline transition-all ease-linear text-white/0 duration-0',
            'text-xl',
            'bg-0_100',
            'text-white/0',
            'bg-gradient-to-r from-white to-white bg-no-repeat bg-clip-text',
            { '!bg-100_100 !duration-[max(var(--dynamicDuartion),_500ms)]' : trigger },
            ]"
            :style="{'--dynamicDuartion': `${props.text.length * 10}ms`}"
            >{{props.text}}</span>
        </p>
      </section>
    </div>
  </section>
</template>
