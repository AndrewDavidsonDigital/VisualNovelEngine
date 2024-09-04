<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useConfiguration } from '@stores/configuration';
  import { useScriptEngine } from '@stores/scriptEngine';
  import { useVoiceEngine } from '@stores/audio';
  import {
    RefreshIcon,
    EyeIcon,
    BookIcon,
    GitMergeIcon,
    SkipIcon,
    VolumeIcon,
    SlidersIcon,
    CloseIcon,
    MenuIcon,
    SaveIcon,
    LoadIcon,
    DownChevronsIcon,
  } from '@components/icon';
  import Modal from '@components/Modal.vue';
  import Clickable from '@components/Clickable.vue';
  import Option from '@views/menus/Options.vue';
  import Save from '@views/menus/Save.vue';
  import { innerClickEvent } from '@lib/mouse';
  import { 
    ConfirmDialog,
    MessageDialog,
  } from '@components/Dialogs';
  import { trace } from '@lib/logging';
  import { IChoice } from '@stores/interfaces';
  const LOGGING_PREFIX = '🖼️ScenePlayer:\t';


  interface Props {
    text: string,
    speaker: string | null,
    trigger: boolean,
    choices?: IChoice[],
    decisions?: string[],
  }
  const props = defineProps<Props>()

  const $emit = defineEmits(['toggleBackdrop', 'progress', 'skip', 'choose'])

  const config = useConfiguration()
  const script = useScriptEngine()
  const voiceEngine = useVoiceEngine()

  const isMenuOpen = ref(false);
  const isModalOpen = ref(false);
  const isAuto = ref(false);
  const isViewBackdrop = ref(false);
  const isSaveLoadSave = ref(false);

  const historyDialogToggle = ref(false);
  const decisionDialogToggle = ref(false);
  const optionsDialogToggle = ref(false);
  const saveLoadDialogToggle = ref(false);

  

  const history = ref(script.$state.chapterDetails.history);

  const lastProgress = ref(Date.now());
  const timer = ref(false);
  const timerId = ref<number>(-1);
  const timerId_auto = ref<number>(-1);
  const autoDuration = ref<number>(500 / config.text.autoWaitRatio);

  const transitionDuration = ref<number>(props.text.length * 10 / config.text.displayRatio);

  const messageDialogContent = ref('');
  const showingMessageDialog = ref<boolean>(false);
  
  const showingConfirmDialog = ref(false);
  const confirmDontShowAgain = ref<boolean>(false);


  function autoToggle(){
    isAuto.value = !isAuto.value;

    if (Date.now() > lastProgress.value + transitionDuration.value + autoDuration.value){
      clearTimer();
      $emit('progress');
    }
  }

  function skipToggle(){
    const skipMessage = script.getSkipDescription;
    if (skipMessage){
      messageDialogContent.value = skipMessage;
      showingMessageDialog.value = true;
    }
    $emit('skip');
    setTransitionDuration(true);
    isAuto.value = false;
  }

  function viewBackdropToggle(){
    isViewBackdrop.value = !isViewBackdrop.value;
    $emit('toggleBackdrop', isViewBackdrop.value)
  }

  function historyToggle(){
    if (history.value?.length === 0) return;
    historyDialogToggle.value = !historyDialogToggle.value;
  }

  function decisionToggle(){
    decisionDialogToggle.value = !decisionDialogToggle.value;
  }

  function viewOptions(){
    optionsDialogToggle.value = !optionsDialogToggle.value;
  }

  function checkBgClick(event: MouseEvent){
    innerClickEvent(event);

    if (isModalOpen.value){
      if (optionsDialogToggle.value) {
        viewOptions();
      }
      if (historyDialogToggle.value) {
        historyToggle();
      }
      return;
    }
    if (isMenuOpen.value) {
      setMenu(false);
      return;
    }
    if (isViewBackdrop.value){
      viewBackdropToggle();
    } else {
      clearTimer();
      isAuto.value = false;
      $emit('progress');
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
    if (timerId_auto.value !== -1){
      clearTimeout(timerId_auto.value);
    }
  }

  function resetTimer(){
    clearTimer();
    timer.value = false;
    const durr = (transitionDuration.value < 500 ? 500 : transitionDuration.value);
    // trace(`${LOGGING_PREFIX}creating timeout for ${durr}` );
    const id = setTimeout(() => {
      timer.value = true;
      timerId.value = -1;
      const id = setTimeout(() => {
        timmerIsUp();
        clearTimeout(timerId_auto.value);
      }, autoDuration.value);
      timerId_auto.value = id as unknown as number;
      clearTimeout(timerId.value);
    }, durr) as unknown as number;
    timerId.value = id;
  }

  function timmerIsUp(){
    // trace(`${LOGGING_PREFIX}timeout UP, should auto ${isAuto.value}` );
    if (isAuto.value){
      $emit('progress');
    }
  }

  function setTransitionDuration(force = false){
    const newValue = props.text.length * 10 / config.text.displayRatio;
    // trace(`${LOGGING_PREFIX} setTransitionDuration - length: ${newValue}` );
    if (force && transitionDuration.value === newValue){
      transitionDuration.value++;
    } else {
      transitionDuration.value = Math.floor(newValue)
    }
    // trace(`${LOGGING_PREFIX} setTransitionDuration - duration: ${transitionDuration.value}` );
  }

  function toggleOpening (isOppnening: boolean){
    isModalOpen.value = isOppnening;
  }

  function closeHistory(){
    toggleOpening(false);
    historyDialogToggle.value = false;
  }

  function closeDecision(){
    toggleOpening(false);
    decisionDialogToggle.value = false;
  }

  function setMenu(to = true){
    isMenuOpen.value = to;
  }

  function handleSaveLoad(isSave: boolean){
    saveLoadDialogToggle.value = true;
    isSaveLoadSave.value = isSave;
  }

  function toggleSaveLoadDialog(){
    saveLoadDialogToggle.value = false;
  }

  function handleSkipClick(event: MouseEvent){
    innerClickEvent(event)
    if (confirmDontShowAgain.value){
      skipToggle();
    } else {
      showingConfirmDialog.value = true
    }
  }

  function toggleDontShow(){
    const node = document.getElementById('dontShowId') as HTMLInputElement;
    node.checked = !node.checked;
  }

</script>

<template>
  <MessageDialog
    :message="messageDialogContent"
    :show="showingMessageDialog"
    @close-ok="showingMessageDialog = false"
  />
  <ConfirmDialog 
    message="Skipping content in a narative centric game can drastically reduce your enjoyment due to posibly missing key / core information, Are you sure you want to skip?"
    :show="showingConfirmDialog"
    :customisation="{
      centerMessage: true,
    }"
    @close-ok="(e) => {showingConfirmDialog = false; skipToggle();}"
    @close-cancel="showingConfirmDialog = false"
  >
    <span class="flex gap-2 justify-center"><input type="checkbox" v-model="confirmDontShowAgain" id="dontShowId"/><p @click="toggleDontShow()">Don't show this next time</p></span>
  </ConfirmDialog>
  <Modal
    :id="`saveLoad-dialog`"
    :show="saveLoadDialogToggle"
    class="scrollbar overflow-hidden"
    @click.stop
    @open="() => toggleOpening(true)"
    @close="() => toggleOpening(false)"
  >
    <Save 
      v-if="saveLoadDialogToggle && isSaveLoadSave"
      routeless
      @close="toggleSaveLoadDialog"
    />
    <section 
      v-else-if="saveLoadDialogToggle"
      class="bg-green-500 w-full h-full"
    >
      LOAD
      <article class="absolute top-0 right-0 group mr-5 mt-4" @click="toggleSaveLoadDialog">
        <CloseIcon class="group-hover:stroke-orange-500 tranition-colors duration-300 scale-150"/>
      </article>
    </section>
  </Modal>
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
    :show="historyDialogToggle"
    class="scrollbar"
    @click.stop
    @open="() => toggleOpening(true)"
    @close="() => toggleOpening(false)"
  >
    <section class="flex flex-col p-5 gap-y-2">
      <template v-for="entry in history">
        <article class="grid grid-cols-[8rem,_1fr] gap-4">
          <div class="flex justify-start h-fit items-center gap-x-1 ml-[2%]">
            <p class="text-xl text-orange-400">{{ entry.actorName }}</p>
            <Clickable>
              <article 
                class="hover:stroke-orange-400 cursor-pointer mt-1"
                @click.stop="voiceEngine.setAndPlay(entry.audioPath)"
              ><VolumeIcon v-show="entry.audioPath?.length > 0" class="hover:stroke-orange-400" />
              </article>
            </Clickable>
          </div>
          <div>
            <span 
              v-html="entry.text" 
              :class="[{ 'italic text-teal-500' : entry?.isChoice }]"
            ></span>
          </div>
        </article>
      </template>
      <article class="absolute top-0 right-0 group mr-5 mt-4" @click="closeHistory">
        <CloseIcon class="group-hover:stroke-orange-500 tranition-colors duration-300 scale-150"/>
      </article>
    </section>
  </Modal>
  <Modal
    :id="`decisionTree-dialog`"
    :show="decisionDialogToggle"
    class="scrollbar"
    @click.stop
    @open="() => toggleOpening(true)"
    @close="() => toggleOpening(false)"
  >
    <section class="flex flex-col items-center p-5 gap-y-2">
      <article class="flex flex-col items-center">
        <div class="border border-solid bg-slate-700/80 w-fit py-2 px-6 rounded-md">Start</div>
        <template v-for="decicion in props.decisions">
          <DownChevronsIcon />
          <div class="border border-solid bg-slate-700/80 w-fit py-2 px-6 rounded-md">{{decicion}}</div>
        </template>
      </article>
      <article class="absolute top-0 right-0 group mr-5 mt-4" @click="closeDecision">
        <CloseIcon class="group-hover:stroke-orange-500 transition-colors duration-300 scale-150"/>
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
            @click.stop="(event: MouseEvent) => handleSkipClick(event)"
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
            @click.stop="(event: MouseEvent) => {historyToggle(); innerClickEvent(event)}"
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
        <Clickable>
          <article 
            v-show="!isViewBackdrop && (props?.decisions && props.decisions.length > 0)"
            @click.stop="(event: MouseEvent) => {decisionToggle(); innerClickEvent(event)}"
            :disabled="history?.length === 0"
            :class='[
              "flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg group cursor-pointer",
            ]'>
            <GitMergeIcon class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"/>
          </article>
        </Clickable>
      </section>
      <section class='flex justify-between px-8 py-4 gap-x-4'>
        <Clickable>
          <article 
            v-show="!isViewBackdrop"
            @click.stop="(event: MouseEvent) => {autoToggle(); innerClickEvent(event)}"
            class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group">
            <RefreshIcon
              :class='[
                "[animation-duration:_3s] transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400",
                { "animate-spin stroke-orange-300/80": isAuto },
                { "animate-end": !isAuto },
              ]'
            />
          </article>
        </Clickable>
        <Clickable>
          <article
            v-show="!isViewBackdrop"
            @click.stop="(event: MouseEvent) => {viewBackdropToggle(); innerClickEvent(event)}"
            class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group">
            <EyeIcon class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"/>
          </article>
        </Clickable>
        <Clickable>
          <article
            v-show="!isViewBackdrop"
            @click.stop="(event: MouseEvent) => {setMenu(); innerClickEvent(event)}"
            class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group">
            <MenuIcon class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"/>
          </article>
        </Clickable>
      </section>
    </div>
    <section 
      v-if="props.choices && props.choices.length > 0 && !isViewBackdrop"
      :class="[
        'flex justify-around !duration-[max(var(--dynamicDuration),_500ms)] opacity-0',
        { 'opacity-100': !timer },
      ]"
      :style="{'--dynamicDuration': `${transitionDuration}ms`}"
    >
      <template v-for="choice in props.choices">
        <Clickable :inline="false">
          <button
            class="bg-slate-700/80 px-4 py-2 rounded-sm"
            @click.stop="() => $emit('choose', choice)"
          >
            {{ choice.value }}
          </button>
        </Clickable>
      </template>
    </section>
    <div v-show="!isViewBackdrop" class="min-h-[20%] mb-4">
      <section class='flex flex-col items-center px-8 py-4 h-full bg-slate-600/50 rounded-2xl glass'>
        <h3 class="text-3xl min-h-8 transition-all text-orange-400">{{props.speaker}}</h3>
        <p class="reveal">
          <span :class="[
            { '!bg-100_100 !duration-[max(var(--dynamicDuration),_500ms)]' : trigger },
            { '[&>span>ruby]:text-opacity-100': trigger && timer },
            { '[&>span>ruby]:!duration-0 [&>span>ruby]:!delay-0': !timer },
            { '[&>span>ruby>rt]:text-opacity-100': trigger && timer },
            { '[&>span>ruby>rt]:!duration-0 [&>span>ruby>rt]:!delay-0': !timer },
            ]"
            :style="{'--dynamicDuration': `${transitionDuration}ms`}"
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
    'transition-all duration-500',
    { '!w-1/4' : isMenuOpen },
    { 'translate-x-8' : !isMenuOpen },
  ]">
    <section class=" px-5 py-10 flex flex-col gap-y-2">
      <Clickable>
        <article
          @click.stop="(event: MouseEvent) => {setMenu(false); innerClickEvent(event)}"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2">
          <span class="transition-colors duration-500 group-hover:text-orange-400">Close</span><CloseIcon class="transition-colors duration-500 group-hover:stroke-orange-400"/>
        </article>
      </Clickable>
      <Clickable audible>
        <article
          v-show="!isViewBackdrop"
          @click.stop="(event: MouseEvent) => {setMenu(false); viewOptions(); innerClickEvent(event)}"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2">
          <span class="transition-colors duration-500 group-hover:text-orange-400">Options</span><SlidersIcon class="transition-colors duration-500 group-hover:stroke-orange-400"/>
        </article>
      </Clickable>
      <Clickable audible>
        <article
          v-show="!isViewBackdrop"
          @click.stop="(event: MouseEvent) => {setMenu(false); handleSaveLoad(true); innerClickEvent(event)}"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2">
          <span class="transition-colors duration-500 group-hover:text-orange-400">Save</span><SaveIcon class="transition-colors duration-500 group-hover:stroke-orange-400"/>
        </article>
      </Clickable>
      <Clickable audible>
        <article
          v-show="!isViewBackdrop"
          @click.stop="(event: MouseEvent) => {setMenu(false); handleSaveLoad(false); innerClickEvent(event)}"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2">
          <span class="transition-colors duration-500 group-hover:text-orange-400">Load</span><LoadIcon class="transition-colors duration-500 group-hover:stroke-orange-400"/>
        </article>
      </Clickable>
      <Clickable audible>
        <article
          v-show="!isViewBackdrop"
          @click.stop="(event: MouseEvent) => {setMenu(false); $router.push('/menu'); innerClickEvent(event)}"
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