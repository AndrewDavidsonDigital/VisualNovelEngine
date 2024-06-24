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
  const isPoked = ref(false);

  import { useScriptEngine } from '@stores/scriptEngine';
  const scriptEngine = useScriptEngine()

  function progress(){
    scriptEngine.progress();
  } 
  function reset(){
    scriptEngine.reset();
  }


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
        <button v-show="!isViewBackdrop" @click="skipToggle()" class="px-4 py-2 bg-white text-black rounded h-fit" >Skip</button>
      </section>
      <section class='flex justify-between px-8 py-4'>
        <button v-show="!isViewBackdrop" @click="autoToggle()" class="px-4 py-2 bg-white text-black rounded h-fit" >{{isAuto ? 'Auto' : 'Pause'}}</button>
        <button @click="viewBackdropToggle()" class="px-4 py-2 bg-white text-black rounded h-fit">{{isViewBackdrop ? 'show' : 'hide'}}</button>
      </section>
    </div>
    <section class="max-w-[10%] flex flex-col gap-5 items-center">
      <button @click="progress()" class="px-4 py-2 bg-white text-black rounded h-fit">Progress</button>
      <button @click="reset()" class="px-4 py-2 bg-white text-black rounded h-fit">Reset</button>
    </section>
    <div v-show="!isViewBackdrop" class="min-h-[20%]">
      <section class='flex flex-col items-center px-8 py-4 h-full bg-slate-600/50'>
        <h3 class="text-2xl min-h-8 transition-all">{{props.speaker}}</h3>
        <p :class="[
          'inline transition-all ease-linear text-white/0 duration-0',
          'bg-0_100',
          'text-white/0',
          'bg-gradient-to-r from-white to-white bg-no-repeat bg-clip-text',
          { '!bg-100_100 !duration-[max(var(--dynamicDuartion),_500ms)]' : trigger },
          ]"
          :style="{'--dynamicDuartion': `${props.text.length * 10}ms`}"
          >{{props.text}}</p>
      </section>
    </div>
  </section>
</template>
