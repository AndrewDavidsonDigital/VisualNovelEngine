<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useConfiguration } from '@stores/configuration';
  import { useScriptEngine } from '@stores/scriptEngine';
  import { useVoiceEngine } from '@stores/audio';
  import {
    RefreshIcon,
    EyeIcon,
    BookIcon,
    SkipIcon,
    VolumeIcon,
  } from '@components/icon';
  import Dialog from '@components/Dialog.vue';
  import Option from '@views/menus/Options.vue';


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
  const voiceEngine = useVoiceEngine()

  const isAuto = ref(false);
  const isViewBackdrop = ref(false);
  const dialogToggle = ref(false);
  const optionsDialogToggle = ref(false);
  const history = ref(script.$state.chapterDetails.history);
  const timer = ref(false);
  const timerId = ref<number>(-1);

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
    if (history.value.length === 0) return;
    dialogToggle.value = !dialogToggle.value;
  }

  function viewOptions(){
    optionsDialogToggle.value = !optionsDialogToggle.value;
  }

  function checkBgClick(event: MouseEvent){
    if (isViewBackdrop.value){
      viewBackdropToggle();
    } else {
      clearTimer();
      props.clickCallback();
    }
  }


  watch(() => props.text, () => {
    setTransitionDuration();
  })

  watch(transitionDuration, () => {
    resetTimer();
  })

  function clearTimer() {
    if (timerId.value !== -1){
      clearTimeout(timerId.value);
    }
  }

  function resetTimer(){
    clearTimer();
    timer.value = false;
    const durr = (transitionDuration.value < 500 ? 500 : transitionDuration.value);
    console.log(`\t: creating timeout for ${durr}`);
    const id = setTimeout(() => {
      timer.value = true;
      timerId.value = -1;
    }, durr);
    timerId.value = id;
  }

  function setTransitionDuration(force = false){
    const newValue = props.text.length * 10 / config.text.displayRatio;
    if (force && transitionDuration.value === newValue){
      transitionDuration.value++;
    } else {
      transitionDuration.value = Math.floor(newValue)
    }
  }

  function playVoiceLine(audioPath: string) {
    voiceEngine.setAndPlay(audioPath);
  }


</script>

<template>
  <Dialog
    :id="`options-dialog`"
    :show="optionsDialogToggle"
    @click.stop
    class="scrollbar backdrop-blur-[5px] !outline-none overflow-hidden"
    >
    <Option 
      routeless
      :onClose="() => viewOptions()"
    />
  </Dialog>
  <Dialog
    :id="`history-dialog`"
    :show="dialogToggle"
    @click.stop
    class="scrollbar backdrop-blur-[5px] !outline-none"
    >
    <section class="flex flex-col p-5 gap-y-2">
      <template v-for="entry in history">
        <article class="grid grid-cols-[8rem,_1fr] gap-4">
          <div class="flex justify-end h-fit items-center gap-x-1">
            <p class="text-xl text-orange-400">{{ entry.actorName }}</p>
            <article 
              class="hover:stroke-orange-400 cursor-pointer mt-1"
              @click.stop="playVoiceLine(entry.audioPath)"
            >
              <VolumeIcon v-show="entry.audioPath?.length > 0" class="hover:stroke-orange-400" />
            </article>
          </div>
          <div><span v-html="entry.text"></span></div>
        </article>
      </template>
    </section>
  </Dialog>
  <section 
    class='flex flex-col justify-between px-8 py-4 aspect-video z-10'
    @click.stop="(e) => checkBgClick(e)">
    <div class='flex justify-between px-8 py-4'>
      <section class='flex justify-between px-8 py-4 gap-x-4'>
        <article 
          v-show="!isViewBackdrop"
          @click.stop="skipToggle()"
          class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group">
          <SkipIcon
            :class='[
              "transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400",
            ]'
          />
        </article>
        <article 
          v-show="!isViewBackdrop"
          @click.stop="historyToggle()"
          :disabled="history.length === 0"
          :class='[
            "flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg group",
            { "cursor-pointer": history.length !== 0 },
          ]'>
          <BookIcon
            :class='[
              "transition-colors duration-500",
              { "hover:stroke-orange-400 group-hover:stroke-orange-400": history.length !== 0 },
            ]'
          />
        </article>
      </section>
      <section class='flex justify-between px-8 py-4 gap-x-4'>
        <article 
          v-show="!isViewBackdrop"
          @click.stop="autoToggle()"
          class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group">
          <RefreshIcon
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
          class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group">
          <EyeIcon class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"/>
        </article>
        <article
          v-show="!isViewBackdrop"
          @click.stop="viewOptions()"
          class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group">
          <EyeIcon class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"/>
        </article>
      </section>
    </div>
    <div v-show="!isViewBackdrop" class="min-h-[20%]">
      <section class='flex flex-col items-center px-8 py-4 h-full bg-slate-600/50 rounded-2xl glass'>
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
  .scrollbar::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  }
  .scrollbar::-webkit-scrollbar-thumb {
    @apply bg-orange-400;
    @apply rounded-lg
  }
  .scrollbar::-webkit-scrollbar {
    @apply w-[0.5em];
  }

  .glass-sm {
    @apply backdrop-blur-[5px];
    @apply ring-slate-600/60;  
    box-shadow: 0 0 4px 2px var(--tw-ring-color);
  }
  .glass {
    @apply backdrop-blur-[5px];
    @apply ring-slate-600/60;  
    box-shadow: 0 0 40px 20px var(--tw-ring-color);
  }

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
    @apply text-center;
  }
</style>