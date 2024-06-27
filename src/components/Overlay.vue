<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useConfiguration } from '@stores/configuration';
  import { useScriptEngine } from '@stores/scriptEngine';
  import AutoIcon from '@components/icon/refresh-cw.vue';
  import EyeIcon from '@components/icon/eye.vue';
  import BookIcon from '@components/icon/book-open.vue';
  import Dialog from '@components/Dialog.vue';

  interface Props {
    text: string,
    speaker: string | null,
    trigger: boolean,
    clickCallback: () => void,
    reset: () => void,
  }
  const props = defineProps<Props>()

  const config = useConfiguration()
  const script = useScriptEngine()

  const isAuto = ref(false);
  const isViewBackdrop = ref(false);
  const dialogToggle = ref(false);
  const history = ref(script.$state.chapterDetails.history);

  const timer = ref(false);
  const transitionDuration = ref<number>(props.text.length * 10 / config.text.displayRatio);

  function autoToggle(){
    isAuto.value = !isAuto.value;
  }
  function skipToggle(){
    console.log('Skipping');
    props.reset();
    setTransitionDuration(true);
  }
  function viewBackdropToggle(){
    isViewBackdrop.value = !isViewBackdrop.value;
  }
  function historyToggle(){
    dialogToggle.value = !dialogToggle.value;
  }

  function checkBgClick(event: MouseEvent){
    if (isViewBackdrop.value){
      viewBackdropToggle();
    } else {
      props.clickCallback();
    }
  }


  watch(() => props.text, () => {
    setTransitionDuration();
  })

  watch(transitionDuration, () => {
    resetTimer();
  })

  function resetTimer(){
    timer.value = false;
    const durr = (transitionDuration.value < 500 ? 500 : transitionDuration.value);
    console.log(`\t: creating timeout for ${durr}`);
    setTimeout(() => {
      timer.value = true;
    }, durr);
  }

  function setTransitionDuration(force = false){
    const newValue = props.text.length * 10 / config.text.displayRatio;
    if (force && transitionDuration.value === newValue){
      transitionDuration.value++;
    } else {
      transitionDuration.value = newValue
    }
  }

</script>

<template>
  <Dialog
    :id="`historyDialog`"
    :show="dialogToggle"
    @click.stop
    >
    <section class="flex flex-col p-5">
      <template v-for="entry in history">
        <article class="grid grid-cols-[8rem,_1fr] gap-4"><div class="text-right text-xl text-orange-400">{{ entry.actorName }}</div><div><span v-html="entry.text"></span></div></article>
      </template>
    </section>
  </dialog>
  <section 
    class='flex flex-col justify-between px-8 py-4 aspect-video z-10'
    @click.stop="(e) => checkBgClick(e)">
    <div class='flex justify-between px-8 py-4'>
      <section>
        <button 
          v-show="!isViewBackdrop"
          @click.stop="skipToggle()"
          class="px-4 py-2 bg-white text-black rounded h-fit" >Skip</button>
        <article 
          v-show="!isViewBackdrop"
          @click.stop="historyToggle()"
          class="flex flex-col justify-center p-2 bg-slate-500/30 rounded-lg cursor-pointer group">
          <BookIcon
            :class='[
              "transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400",
            ]'
          />
        </article>
      </section>
      <section class='flex justify-between px-8 py-4 gap-x-2'>
        <article 
          v-show="!isViewBackdrop"
          @click.stop="autoToggle()"
          class="flex flex-col justify-center p-2 bg-slate-500/30 rounded-lg cursor-pointer group">
          <AutoIcon
            :class='[
              "[animation-duration:_3s] transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400",
              { "animate-spin": isAuto },
              { "animate-end": !isAuto },
            ]'
          />
        </article>
        <article
          v-show="!isViewBackdrop"
          @click.stop="viewBackdropToggle()"
          class="flex flex-col justify-center p-2 bg-slate-500/30 rounded-lg cursor-pointer group">
          <EyeIcon class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"/>
        </article>
      </section>
    </div>
    <div v-show="!isViewBackdrop" class="min-h-[20%]">
      <section class='flex flex-col items-center px-8 py-4 h-full bg-slate-600/50 rounded-2xl'>
        <h3 class="text-3xl min-h-8 transition-all text-orange-400">{{props.speaker}}</h3>
        <p class="reveal">
          <span :class="[
            { '!bg-100_100 !duration-[max(var(--dynamicDuartion),_500ms)]' : trigger },
            { '[&>span>ruby]:text-opacity-100': trigger && timer },
            { '[&>span>ruby]:!duration-0 [&>span>ruby]:!delay-0': !timer },
            { '[&>span>ruby>rt]:text-opacity-100': trigger && timer },
            { '[&>span>ruby>rt]:!duration-0 [&>span>ruby>rt]:!delay-0': !timer },
            ]"
            :style="{'--dynamicDuartion': `${transitionDuration}ms`}"
            v-html="props.text"></span>
        </p>
      </section>
    </div>
  </section>
</template>

<style>
  .reveal {
    ruby, rt, rp {
      @apply text-orange-300 text-opacity-0;
      @apply transition-colors duration-300;
    }    
    > span {
      @apply inline transition-all ease-linear text-white/0 duration-0;
      @apply text-xl bg-0_100;
      @apply bg-gradient-to-r from-white to-white bg-no-repeat !bg-clip-text;
      @apply pt-4; /* Needed padding for furigana (<ruby> tags) */
    }
  }

  .reveal ruby > rt {
    @apply !text-sm;
  }
</style>