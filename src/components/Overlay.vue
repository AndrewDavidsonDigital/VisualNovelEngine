<script setup lang="ts">
  import { ref } from 'vue';
  import AutoIcon from '@components/icon/refresh-cw.vue';
  import EyeIcon from '@components/icon/eye.vue';

  interface Props {
    text: string,
    speaker: string | null,
    trigger: boolean,
    clickCallback: () => void,
    reset: () => void,
  }

  const props = defineProps<Props>()

  const isAuto = ref(false);
  const isViewBackdrop = ref(false);

  function autoToggle(){
    isAuto.value = !isAuto.value;
  }
  function skipToggle(){
    console.log('Skipping');
    props.reset();
  }
  function viewBackdropToggle(){
    isViewBackdrop.value = !isViewBackdrop.value;
  }

  function checkBgClick(event: MouseEvent){
    if (isViewBackdrop.value){
      viewBackdropToggle();
    } else {
      props.clickCallback();
    }
  }

</script>

<template>
  <section 
    class='flex flex-col justify-between px-8 py-4 aspect-video z-10'
    @click.stop="(e) => checkBgClick(e)">
    <div class='flex justify-between px-8 py-4'>
      <section>
        <button 
          v-show="!isViewBackdrop"
          @click.stop="skipToggle()"
          class="px-4 py-2 bg-white text-black rounded h-fit" >Skip</button>
      </section>
      <section class='flex justify-between px-8 py-4 gap-x-2'>
        <article 
          v-show="!isViewBackdrop"
          @click.stop="autoToggle()"
          class="flex flex-col justify-center p-2 bg-slate-500/30 rounded-lg cursor-pointer">
          <AutoIcon
            :class='[
              "[animation-duration:_3s]",
              { "animate-spin": isAuto },
            ]'
          />
        </article>
        <article
          v-show="!isViewBackdrop"
          @click.stop="viewBackdropToggle()"
          class="flex flex-col justify-center p-2 bg-slate-500/30 rounded-lg cursor-pointer">
          <EyeIcon />
        </article>
      </section>
    </div>
    <div v-show="!isViewBackdrop" class="min-h-[20%]">
      <section class='flex flex-col items-center px-8 py-4 h-full bg-slate-600/50 rounded-2xl'>
        <h3 class="text-3xl min-h-8 transition-all text-orange-400">{{props.speaker}}</h3>
        <p class="reveal">
          <span :class="{ '!bg-100_100 !duration-[max(var(--dynamicDuartion),_500ms)]' : trigger }"
            :style="{'--dynamicDuartion': `${props.text.length * 10}ms`}"
            v-html="props.text"></span>
        </p>
      </section>
    </div>
  </section>
</template>

<style>
  .reveal {
    ruby, rt, rp {
      @apply text-orange-300/0;
      /* @apply mix-blend-hue; */
    }    
    > span {
      @apply inline transition-all ease-linear text-white/0 duration-0;
      @apply text-xl bg-0_100;
      @apply bg-gradient-to-r from-white to-white bg-no-repeat !bg-clip-text;
      @apply pt-4;
    }
  }
  .reveal span:has(> ruby) {
    @apply inline transition-all ease-linear text-orange-300/0;
    @apply text-xl bg-0_100;
    @apply !bg-gradient-to-r !from-white !to-white !bg-clip-text;
    @apply pt-4; /* need padding for posibility of furigana */
  } 

  .reveal ruby > rt {
    @apply !text-sm;
  }
</style>