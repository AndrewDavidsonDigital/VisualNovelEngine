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
    EllipsisIcon,
  } from '@components/icon';
  import Modal from '@components/Modal.vue';
  import Clickable from '@components/Clickable.vue';
  import Option from '@views/menus/Options.vue';
  import Save from '@views/menus/Save.vue';
  import { innerInteractionEvent } from '@lib/interactions';
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

  const instantiationDate = Date.now();

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
    innerInteractionEvent(event);

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
        timerIsUp();
        clearTimeout(timerId_auto.value);
      }, autoDuration.value);
      timerId_auto.value = id as unknown as number;
      clearTimeout(timerId.value);
    }, durr) as unknown as number;
    timerId.value = id;
  }

  function timerIsUp(){
    trace(`${LOGGING_PREFIX}timeout UP, should auto ${isAuto.value}` );
    if (isAuto.value){
      $emit('progress');
    }
  }

  function setTransitionDuration(force = false){
    trace(`${LOGGING_PREFIX} setTransitionDuration - text: ${props.text}` );
    const newValue = props.text.length * 10 / config.text.displayRatio;
    // trace(`${LOGGING_PREFIX} setTransitionDuration - length: ${newValue}` );
    if (force && transitionDuration.value === newValue){
      transitionDuration.value++;
    } else {
      transitionDuration.value = Math.floor(newValue)
    }
    // trace(`${LOGGING_PREFIX} setTransitionDuration - duration: ${transitionDuration.value}` );
  }

  function toggleOpening (isOpening: boolean){
    isModalOpen.value = isOpening;
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


  function handleSkipClick(event: MouseEvent | KeyboardEvent){
    innerInteractionEvent(event)
    if (confirmDontShowAgain.value){
      skipToggle();
    } else {
      showingConfirmDialog.value = true
    }
  }

</script>

<template>
  <MessageDialog
    :message="messageDialogContent"
    :show="showingMessageDialog"
    @close-ok="showingMessageDialog = false"
  />
  <ConfirmDialog 
    message="Skipping content in a narrative centric game can drastically reduce your enjoyment due to possibly missing key / core information, Are you sure you want to skip?"
    :show="showingConfirmDialog"
    :customisation="{
      centerMessage: true,
    }"
    @close-ok="(_e) => {showingConfirmDialog = false; skipToggle();}"
    @close-cancel="(_e) => {showingConfirmDialog = false; confirmDontShowAgain = false}"
  >
    <span class="flex gap-2 justify-center">
      <input 
        type="checkbox" 
        v-model="confirmDontShowAgain" 
        id="confirmCheckbox"
        @click.stop
      />
      <label for="confirmCheckbox">Don't show this next time</label>
    </span>
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
      <button class="absolute top-0 right-0 group mr-5 mt-4" @click="toggleSaveLoadDialog">
        <CloseIcon 
          class="group-hover:stroke-orange-500 transition-colors duration-300 scale-150" 
          aria-label="Close Modal"
        />
      </button>
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
      <template v-for="(entry, index) in history" :key="`history_${index}__${instantiationDate}`">
        <article class="grid grid-cols-[8rem,_1fr] gap-4">
          <div class="flex justify-start h-fit items-center gap-x-1 ml-[2%]">
            <p class="text-xl text-orange-400">{{ entry.actorName }}</p>
            <Clickable>
              <button 
                class="cursor-pointer align-middle"
                @click.stop="voiceEngine.setAndPlay(entry.audioPath)"
                aria-label="Replay voice-line"
              ><VolumeIcon 
                v-show="entry.audioPath?.length > 0" 
                class="hover:stroke-orange-400 transition-all duration-300"

              />
              </button>
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
      <button class="absolute top-0 right-0 group mr-5 mt-4" @click="closeHistory">
        <CloseIcon class="group-hover:stroke-orange-500 transition-colors duration-300 scale-150"/>
      </button>
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
        <template v-for="(decision, index) in props.decisions"  :key="`decision_${index}__${instantiationDate}`">
          <DownChevronsIcon />
          <div class="border border-solid bg-slate-700/80 w-fit py-2 px-6 rounded-md">{{decision}}</div>
        </template>
      </article>
      <button class="absolute top-0 right-0 group mr-5 mt-4" @click="closeDecision">
        <CloseIcon class="group-hover:stroke-orange-500 transition-colors duration-300 scale-150"/>
      </button>
    </section>
  </Modal>
  <section 
    id="modal_backdrop"
    class="z-modal-backdrop bg-slate-600/40 transition-all [transition-behavior:_allow-discrete] hidden duration-300 opacity-0"
    :class="{
      'open' : showingConfirmDialog || showingMessageDialog,
    }"
  ></section>
  <section
    class='flex flex-col justify-between px-8 py-4 aspect-video z-10'
    :class="{'pointer-events-none': showingConfirmDialog || showingMessageDialog }"
    @click.stop="(e) => checkBgClick(e)"
    role="presentation"
    data-layer="overlay"
  >
    <div class='flex justify-between px-8 py-4'>
      <section class='flex justify-between px-8 py-4 gap-x-4'>
        <Clickable>
          <button 
            v-show="!isViewBackdrop"
            @click.stop="(event: MouseEvent) => handleSkipClick(event)"
            class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group interactable-styling"
            aria-label="Skip current chapter"
          >
            <SkipIcon
              :class='[
                "transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400",
              ]'
              role="none"
            />
          </button>
        </Clickable>
        <Clickable>
          <button 
            v-show="!isViewBackdrop"
            @click.stop="(event: MouseEvent) => {historyToggle(); innerInteractionEvent(event)}"
            @keydown.space="(event: KeyboardEvent) => {historyToggle(); innerInteractionEvent(event)}"
            aria-label="View text history"
            :disabled="history?.length === 0"
            :class='[
              "flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg group interactable-styling",
              { "cursor-pointer": history?.length !== 0 },
            ]'>
            <BookIcon
              :class='[
                "transition-colors duration-500",
                { "hover:stroke-orange-400 group-hover:stroke-orange-400": history?.length !== 0 },
              ]'
              role="none"
            />
          </button>
        </Clickable>
        <Clickable>
          <button 
            v-show="!isViewBackdrop && (props?.decisions && props.decisions.length > 0)"
            @click.stop="(event: MouseEvent) => {decisionToggle(); innerInteractionEvent(event)}"
            @keydown.space="(event: KeyboardEvent) => {decisionToggle(); innerInteractionEvent(event)}"
            aria-label="View choices made"
            :disabled="history?.length === 0"
            :class='[
              "flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg group cursor-pointer interactable-styling",
            ]'>
            <GitMergeIcon 
              class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"
              role="none"
            />
          </button>
        </Clickable>
      </section>
      <section class='flex justify-between px-8 py-4 gap-x-4'>
        <Clickable>
          <button 
            v-show="!isViewBackdrop"
            @click.stop="(event: MouseEvent) => {autoToggle(); innerInteractionEvent(event)}"
            @keydown.space="(event: KeyboardEvent) => {autoToggle(); innerInteractionEvent(event)}"
            :aria-label="`${isAuto ? 'Enable' : 'Disable' } automatic progression`"
            class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group interactable-styling">
            <RefreshIcon
              :class='[
                "[animation-duration:_3s] transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400",
                { "animate-spin stroke-orange-300/80": isAuto },
                { "animate-end": !isAuto },
              ]'
              role="none"
            />
          </button>
        </Clickable>
        <Clickable>
          <button
            v-show="!isViewBackdrop"
            @click.stop="(event: MouseEvent) => {viewBackdropToggle(); innerInteractionEvent(event)}"
            @keydown.space="(event: KeyboardEvent) => {viewBackdropToggle(); innerInteractionEvent(event)}"
            class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group interactable-styling"
            aria-label="Hide UI and display backdrop"
          >
            <EyeIcon 
              class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"
              role="none"
            />
          </button>
        </Clickable>
        <Clickable>
          <button
            v-show="!isViewBackdrop"
            @click.stop="(event: MouseEvent) => {setMenu(); innerInteractionEvent(event)}"
            @keydown.space="(event: KeyboardEvent) => {setMenu(); innerInteractionEvent(event)}"
            class="flex flex-col justify-center p-2 bg-slate-500/30 glass-sm rounded-lg cursor-pointer group interactable-styling "
            aria-label="Show menu"
          >
            <MenuIcon 
              class="transition-colors duration-500 hover:stroke-orange-400 group-hover:stroke-orange-400"
              role="none"
            />
          </button>
        </Clickable>
      </section>
    </div>
    <section 
      v-if="props.choices && props.choices.length > 0 && !isViewBackdrop"
      :class="[
        'flex justify-around ![animation-duration:1s] animate-fadeIn animation-forwards !animation-delay-[max(var(--dynamicDuration),_500ms)] opacity-0',
      ]"
      :style="{'--dynamicDuration': `${transitionDuration}ms`}"
    >
      <template v-for="(choice, index) in props.choices" :key="`choices_${index}__${instantiationDate}`">
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
    <div v-show="!isViewBackdrop" class="min-h-[20%] mb-4 relative">
      <div class="absolute right-8 top-6 size-9 flex items-end justify-center rounded-full">
        <button
          class="size-5 interactable-styling rounded-sm"
          @keydown.space="(_event: KeyboardEvent) => {$emit('progress')}"
          :tabindex="isMenuOpen ? -1 : 0"
          aria-label="Progress scene"
        >
          <EllipsisIcon 
            v-if="trigger && timer"
            role="none"
          />
        </button>
      </div>
      <section class='flex flex-col items-center px-8 py-4 h-full bg-slate-600/50 rounded-2xl glass'>
        <h3 
          class="text-3xl min-h-8 transition-all text-orange-400"
          :role="`${props.speaker ? 'heading' : 'none'}`"
        >{{props.speaker}}</h3>
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
      'w-0 max-w-[400px]', 
      'glass z-menu ml-auto rounded-l-xl',
      'transition-all duration-500',
      { '!w-1/4' : isMenuOpen },
      { 'translate-x-8' : !isMenuOpen },
    ]">
    <section class="px-5 py-10 flex flex-col gap-y-2">
      <Clickable>
        <button
          @click.stop="(event: MouseEvent) => {setMenu(false); innerInteractionEvent(event)}"
          @keydown.space="(_event: KeyboardEvent) => {setMenu(false); innerInteractionEvent(_event)}"
          :tabindex="isMenuOpen ? 0 : -1"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2 w-full interactable-styling"
          aria-label="Close Menu"
        >
          <span 
            class="transition-colors duration-500 group-hover:text-orange-400 group-focus-visible:!text-orange-400"
          >Close</span>
          <CloseIcon 
            role="none"
            class="transition-colors duration-500 group-hover:stroke-orange-400 group-focus-visible:!stroke-orange-400"
          />
        </button>
      </Clickable>
      <Clickable>
        <button
          v-show="!isViewBackdrop"
          @click.stop="(event: MouseEvent) => {setMenu(false); viewOptions(); innerInteractionEvent(event)}"
          @keydown.space="(_event: KeyboardEvent) => {setMenu(false); viewOptions(); innerInteractionEvent(_event)}"
          :tabindex="isMenuOpen ? 0 : -1"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2 w-full interactable-styling"
          aria-label="Open Options Menu"
        >
          <span 
            class="transition-colors duration-500 group-hover:text-orange-400 group-focus-visible:!text-orange-400"
          >Options</span>
          <SlidersIcon 
            role="none"
            class="transition-colors duration-500 group-hover:stroke-orange-400 group-focus-visible:!stroke-orange-400"
          />
        </button>
      </Clickable>
      <Clickable>
        <button
          v-show="!isViewBackdrop"
          @click.stop="(event: MouseEvent) => {setMenu(false); handleSaveLoad(true); innerInteractionEvent(event)}"
          @keydown.space="(_event: KeyboardEvent) => {setMenu(false); handleSaveLoad(true); innerInteractionEvent(_event)}"
          :tabindex="isMenuOpen ? 0 : -1"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2 w-full interactable-styling"
          aria-label="Open Save Menu"
        >
          <span 
            class="transition-colors duration-500 group-hover:text-orange-400 group-focus-visible:!text-orange-400"
          >Save</span>
          <SaveIcon 
            role="none"
            class="transition-colors duration-500 group-hover:stroke-orange-400 group-focus-visible:!stroke-orange-400"
          />
        </button>
      </Clickable>
      <Clickable>
        <button
          v-show="!isViewBackdrop"
          @click.stop="(event: MouseEvent) => {setMenu(false); handleSaveLoad(false); innerInteractionEvent(event)}"
          @keydown.space="(_event: KeyboardEvent) => {setMenu(false); handleSaveLoad(false); innerInteractionEvent(_event)}"
          :tabindex="isMenuOpen ? 0 : -1"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2 w-full interactable-styling"
          aria-label="Open Load Menu"
        >
          <span 
            class="transition-colors duration-500 group-hover:text-orange-400 group-focus-visible:!text-orange-400"
          >Load</span>
          <LoadIcon 
            role="none"
            class="transition-colors duration-500 group-hover:stroke-orange-400 group-focus-visible:!stroke-orange-400"
          />
        </button>
      </Clickable>
      <Clickable>
        <button
          v-show="!isViewBackdrop"
          @click.stop="(event: MouseEvent) => {setMenu(false); $router.push('/menu'); innerInteractionEvent(event)}"
          @keydown.space="(_event: KeyboardEvent) => {setMenu(false); $router.push('/menu'); innerInteractionEvent(_event)}"
          :tabindex="isMenuOpen ? 0 : -1"
          class="flex justify-between p-2 rounded-lg cursor-pointer group gap-x-2 w-full interactable-styling"
          aria-label="Return to the Title Screen"
        >
          <span 
            class="transition-colors duration-500 group-hover:text-orange-400 group-focus-visible:!text-orange-400"
          >Title</span>
          <SlidersIcon 
            role="none"
            class="transition-colors duration-500 group-hover:stroke-orange-400 group-focus-visible:!stroke-orange-400"
          />
        </button>
      </Clickable>
    </section>
  </aside>
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
    @apply text-center;
  }
</style>

<style scoped>


  #modal_backdrop.open{
    @apply block;
    @apply opacity-100;

    @starting-style {
      opacity: 0;
    }
  }

  #modal_backdrop {
    @starting-style {
      opacity: 0;
    }
  }
  .interactable-styling{
    &:focus-visible {
      @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-500/80
    }
  }
</style>