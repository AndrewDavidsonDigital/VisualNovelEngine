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
    SlidersIcon,
    CloseIcon,
    MenuIcon,
    SaveIcon,
    LoadIcon,
  } from '@components/icon';
  import Modal from '@components/Modal.vue';
  import Clickable from '@components/Clickable.vue';
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

  const isMenuOpen = ref(false);
  const isModalOpen = ref(false);
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
    if (history.value?.length === 0) return;
    dialogToggle.value = !dialogToggle.value;
  }

  function viewOptions(){
    optionsDialogToggle.value = !optionsDialogToggle.value;
  }

  function checkBgClick(event: MouseEvent){
    if (isModalOpen.value){
      if (optionsDialogToggle.value) {
        viewOptions();
      }
      if (dialogToggle.value) {
        historyToggle();
      }
      return;
    }
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

  function toggleOpening (isOppnening: boolean){
    isModalOpen.value = isOppnening;
  }

  function closeHistory(){
    toggleOpening(false);
    dialogToggle.value = false;
  }

  function setMenu(to = true){
    isMenuOpen.value = to;
  }

</script>

<template>
  <Modal
    :id="`options-dialog`"
    :show="optionsDialogToggle"
    class="scrollbar overflow-hidden"
    @click.stop
    @open="() => toggleOpening(true)"
    @close="() => toggleOpening(false)"
    >
    <Option
      v-if="optionsDialogToggle"
      routeless
      :onClose="() => viewOptions()"
    />
  </Modal>
  <Modal
    :id="`history-dialog`"
    :show="dialogToggle"
    class="scrollbar"
    @click.stop
    @open="() => toggleOpening(true)"
    @close="() => toggleOpening(false)"
    >
    <section class="flex flex-col p-5 gap-y-2">
      <template v-for="entry in history">
        <article class="grid grid-cols-[8rem,_1fr] gap-4">
          <div class="flex justify-end h-fit items-center gap-x-1">
            <p class="text-xl text-orange-400">{{ entry.actorName }}</p>
            <Clickable>
              <article 
                class="hover:stroke-orange-400 cursor-pointer mt-1"
                @click.stop="playVoiceLine(entry.audioPath)"
              ><VolumeIcon v-show="entry.audioPath?.length > 0" class="hover:stroke-orange-400" />
              </article>
            </Clickable>
          </div>
          <div><span v-html="entry.text"></span></div>
        </article>
      </template>
      <article class="absolute top-0 right-0 group mr-5 mt-4" @click="closeHistory">
        <CloseIcon class="group-hover:stroke-orange-500 tranition-colors duration-300 scale-150"/>
      </article>
    </section>
  </Modal>
  <section 
    class='flex flex-col justify-between px-8 py-4 aspect-video z-10'
    @click.stop="(e) => checkBgClick(e)">
    <div class='flex justify-between px-8 py-4'>
      <section class='flex justify-between px-8 py-4 gap-x-4'>
        <Clickable>
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
        </Clickable>
        <Clickable>
          <article 
            v-show="!isViewBackdrop"
            @click.stop="historyToggle()"
            :disabled="history?.length === 0"
            :class='[
              "flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg group",
              { "cursor-pointer": history?.length !== 0 },
            ]'>
            <BookIcon
              :class='[
                "transition-colors duration-500",
                { "hover:stroke-orange-400 group-hover:stroke-orange-400": history?.length !== 0 },
              ]'
            />
          </article>
        </Clickable>
      </section>
      <section class='flex justify-between px-8 py-4 gap-x-4'>
        <Clickable>
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
        </Clickable>
        <Clickable>
          <article
            v-show="!isViewBackdrop"
            @click.stop="viewBackdropToggle()"
            class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group">
            <EyeIcon class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"/>
          </article>
        </Clickable>
        <Clickable>
          <article
            v-show="!isViewBackdrop"
            @click.stop="setMenu()"
            class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group">
            <MenuIcon class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"/>
          </article>
        </Clickable>
      </section>
    </div>
    <div v-show="!isViewBackdrop" class="min-h-[20%] mb-4">
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
  <aside 
  :class="[
    'bg-slate-500/80',
    ' w-0 max-w-[400px]', 
    'glass z-menu ml-auto rounded-l-xl',
    'transition-all duration-500 ',
    { '!w-1/4' : isMenuOpen },
  ]">
    <section class=" px-5 py-10 flex flex-col gap-y-2">
      <Clickable>
        <article
          @click.stop="setMenu(false)"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2">
          <span class="transition-colors duration-500 group-hover:text-orange-400">Close</span><CloseIcon class="transition-colors duration-500 group-hover:stroke-orange-400"/>
        </article>
      </Clickable>
      <Clickable>
        <article
          v-show="!isViewBackdrop"
          @click.stop="() => {setMenu(false); viewOptions();}"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2">
          <span class="transition-colors duration-500 group-hover:text-orange-400">Options</span><SlidersIcon class="transition-colors duration-500 group-hover:stroke-orange-400"/>
        </article>
      </Clickable>
      <Clickable>
        <article
          v-show="!isViewBackdrop"
          @click.stop="() => {setMenu(false);}"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2">
          <span class="transition-colors duration-500 group-hover:text-orange-400">Save</span><SaveIcon class="transition-colors duration-500 group-hover:stroke-orange-400"/>
        </article>
      </Clickable>
      <Clickable>
        <article
          v-show="!isViewBackdrop"
          @click.stop="() => {setMenu(false);}"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2">
          <span class="transition-colors duration-500 group-hover:text-orange-400">Load</span><LoadIcon class="transition-colors duration-500 group-hover:stroke-orange-400"/>
        </article>
      </Clickable>
      <Clickable>
        <article
          v-show="!isViewBackdrop"
          @click.stop="() => {setMenu(false); $router.push('/menu')}"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2">
          <span class="transition-colors duration-500 group-hover:text-orange-400">Title</span><SlidersIcon class="transition-colors duration-500 group-hover:stroke-orange-400"/>
        </article>
      </Clickable>
    </section>
  </aside>
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