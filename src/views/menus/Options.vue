<script setup lang="ts">
  import { nextTick, ref, watch, onBeforeUnmount } from 'vue'
  import { useConfiguration, IConfiguration, IAudioConfiguration, labelMap_EN, ITextConfiguration } from '@stores/configuration';
  import { 
    useBgmEngine, 
    useSfxEngine,
    useInteractionEngine,
    useVoiceEngine,
  } from '&audio'
  import { LoaderIcon } from '@components/icon'
  import { useRouter } from 'vue-router'
  import Clickable from '@components/Clickable.vue'
  import videoSrc from '@assets/video/bg-menu.mp4';
  import { trace as debug } from '@lib/logging';
  import { 
    ConfirmDialog,
  } from '@components/Dialogs';
  import Versioning from '../../Versioning.vue';
import { useStorage } from '@lib/storage';
  const LOGGING_PREFIX = '⚛️OPTIONS:\t';

  const speedIndex = Object.freeze([
    'Slowest',
    'Slower',
    'Average',
    'Faster',
    'Fastest',
  ])

  const router = useRouter()

  const bgmEngine = useBgmEngine()
  const sfxEngine = useSfxEngine()
  const interactionEngine = useInteractionEngine()
  const voiceEngine = useVoiceEngine()

  const config = useConfiguration()
  const stateStorage = useStorage();

  const configurables = config.getConfigurables();
  const localAudio = ref<IAudioConfiguration>(configurables.audio);
  const localText = ref<ITextConfiguration>(configurables.text);

  const showingConfirmDialog = ref<boolean>(false);

  const testingText = Object.freeze({
    speaker: 'Narrator',
    text: '<ruby>Lorem ipsum dolor sit amet<rp>(</rp><rt>mm placeholder text</rt><rp>)</rp> </ruby>, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  });

  const trigger = ref(false);
  const timer = ref(false);
  const timerId_display = ref<number>(-1);
  const timerId_auto = ref<number>(-1);
  const transitionDuration = ref<number>(testingText.text.length * 10 / localText.value.displayRatio);
  const autoDuration = ref<number>(1000 * localText.value.autoWaitRatio);

  interface Props {
    routeless?: boolean,
    onClose?: () => void,
  }
  const props = defineProps<Props>()

  function isIterable(thing: any): boolean{
    if (Array.isArray(thing)){
      return true;
    } else if (typeof thing === 'object'){
      return true;
    }

    return false;
  }

  function resolveValue(thing: any, key: string): any{
    let retval = '';

    try {
      retval = thing[key];
    }catch{
      debug(`${LOGGING_PREFIX}unable to resolve value for key: '${key}' in collection: ${thing}`);
    }

    return retval;
  }

  function resolveLabel(key: string) {
    if (! labelMap_EN.has(key)) return key;
    return labelMap_EN.get(key);
  }

  function saveOnUpdate(audioKey: string){
    const key =  audioKey as keyof IAudioConfiguration;
    nextTick(() => {
      switch(key){
        case('master'):
          bgmEngine.setVolume(configurables.audio.bgm * configurables.audio[key]);
          sfxEngine.setVolume(configurables.audio.sfx * configurables.audio[key]);
          interactionEngine.setVolume(configurables.audio.sfx * configurables.audio[key]);
          voiceEngine.setVolume(configurables.audio.voice * configurables.audio[key]);
          break;
        case('bgm'):
          bgmEngine.setVolume(configurables.audio[key] * configurables.audio.master);
          break;
        case('sfx'):
          sfxEngine.setVolume(configurables.audio[key] * configurables.audio.master);
          interactionEngine.setVolume(configurables.audio[key] * configurables.audio.master);
          break;
        case('voice'):
          voiceEngine.setVolume(configurables.audio[key] * configurables.audio.master);
          break;
        default:
      }
    })
  }

  function testAudio(audioKey: string){
    const key =  audioKey as keyof IAudioConfiguration;
      switch(key){
        case('sfx'):
          sfxEngine.setAndPlay('/audio/sfx/ah.wav');
          break;
        case('voice'):
          voiceEngine.setAndPlay('/audio/voice/yo-da-yo.wav');
          break;
        default:
      }
  }

  function saveConfiguration(destination: string){
    config.$state.audio = {...localAudio.value}
    config.$state.text = {...localText.value}
    config.save();
    if (props.routeless){
      props.onClose ? props.onClose():null;
    } else {
      router.push(destination);
    }
  }

  function discardConfiguration(destination: string){
    if (props.routeless){
      props.onClose ? props.onClose():null;
    } else {
      router.push(destination);
    }
  }

  watch(() => localText.value.displayRatio , () => {
    clearTimer();
    setTransitionDuration();
    restartText();
  })

  watch(() => localText.value.autoWaitRatio , () => {
    clearTimer();
    setAutoPauseDuration();
    restartText();
  })

  watch(transitionDuration, () => {
    resetTimer();
  })

  watch(autoDuration, () => {
    resetTimer();
  })

  function setAutoPauseDuration(){
    const newValue = 500 / localText.value.autoWaitRatio;
    // console.log(`setAutoPauseDuration: ${newValue}`)
    autoDuration.value = newValue;
  }

  function setTransitionDuration(force = false){
    const newValue = (testingText.text.length * 10 / localText.value.displayRatio);
    if (force && transitionDuration.value === newValue){
      transitionDuration.value++;
    } else {
      transitionDuration.value = Math.floor(newValue)
    }
  }

  function clearTimer() {
    if (timerId_display.value !== -1){
      clearTimeout(timerId_display.value);
    }
    if (timerId_auto.value !== -1){
      clearTimeout(timerId_auto.value);
    }
  }

  function resetTimer(){
    clearTimer();
    timer.value = false;
    const durr = (transitionDuration.value < 500 ? 500 : transitionDuration.value);
    // console.log(`\t: creating timeout for ${durr}`);
    const id = setTimeout(() => {
      timer.value = true;
      timerId_display.value = -1;
      // console.log(`\t\t: auto in "${autoDuration.value}"`);
      const id = setTimeout(() => {
        // console.log('\t\t: auto done');
        restartText();
      }, autoDuration.value);
      timerId_auto.value = id as unknown as number;
    }, durr);
    timerId_display.value = id as unknown as number;
  }

  function restartText(){
    trigger.value = false;
    setTimeout(() => {
      trigger.value = true;
      resetTimer();
    }, 50);
  }

  function handleGameReset(){
    showingConfirmDialog.value = true;
  }

/*
  Backup testing Save Data from: 2025-04-04
  [{"title":"ok","active":true,"chapterIndex":1,"sceneIndex":1,"transitionIndex":0,"dateTime":1743745358809},{"title":"start","active":true,"chapterIndex":0,"sceneIndex":0,"transitionIndex":0,"dateTime":1743747276646},{"title":"Choices","active":true,"chapterIndex":2,"sceneIndex":0,"transitionIndex":0,"dateTime":1743041780032},{"title":"New Save","chapterIndex":"","sceneIndex":"","transitionIndex":"","active":false,"dateTime":1722584085844},{"title":"New Save","chapterIndex":"","sceneIndex":"","transitionIndex":"","active":false,"dateTime":1722584085844},{"title":"New Save","chapterIndex":"","sceneIndex":"","transitionIndex":"","active":false,"dateTime":1722584085844},{"title":"New Save","chapterIndex":"","sceneIndex":"","transitionIndex":"","active":false,"dateTime":1722584085844},{"title":"New Save","chapterIndex":"","sceneIndex":"","transitionIndex":"","active":false,"dateTime":1722584085844},{"title":"asdasdasdasd","active":true,"chapterIndex":0,"sceneIndex":0,"transitionIndex":2,"dateTime":1723285933738},{"title":"testing","active":true,"chapterIndex":0,"sceneIndex":0,"transitionIndex":2,"dateTime":1722592826134}]
 */

  function resetGame(){
    stateStorage.reset();
    console.log('deleting game progress');
  }

  restartText();

  // ensure timers are destroyed
  onBeforeUnmount(() => {
    clearTimer();
  });


</script>

<template>
  <ConfirmDialog 
    :message="`This action will irreversibly delete all current game progress; this includes your save files, as well as any unlocks.\n Are you completely sure you wish to proceed`"
    :show="showingConfirmDialog"
    :customisation="{
      centerMessage: true,
      splitOn: '\n',
      okText: 'Yes, Reset GameData',
    }"
    @close-ok="() => {showingConfirmDialog = false; resetGame();}"
    @close-cancel="showingConfirmDialog = false"
  >
  </ConfirmDialog>
  <div class="animate-fadeIn" :class="$attrs.class">
    <div class='grid [grid-template-areas:_"stack"] *:[grid-area:_stack]'>
      <section class='aspect-video pointer-events-none'>
        <video
          autoplay
          loop
          muted
          playsinline
        >
          <source :src="videoSrc" type="video/mp4">
        </video>
      </section>
      <div class='mx-8 my-4 p-4 aspect-video z-10 bg-slate-500/50 rounded-xl flex flex-col justify-between'>
        <div>
          <section class="flex justify-between">
            <h1>Options</h1>
            <span class="flex gap-2">
              <Clickable class="interactable-styling"><a @click="saveConfiguration('/menu')" class="hover:text-orange-400 transition-colors duration-300 text-2xl" tabindex="999">Save</a></Clickable>
              <Clickable class="interactable-styling"><a @click="discardConfiguration('/menu')" class="hover:text-orange-400 transition-colors duration-300 text-2xl" tabindex="1000">Back</a></Clickable>            </span>
          </section>
          <section class='grid grid-cols-2'>
            <div v-for="(key, index) in Object.keys(configurables)" :key="`options_${index}`">
              <h2 class="text-xl">{{resolveLabel(key)}}</h2>
              <template v-if="isIterable(configurables[key as keyof IConfiguration])">
                <template v-if="key === 'audio'">
                  <div v-for="(el, index) in Object.keys(configurables[key])" class="flex justify-around mx-4" :key="`audio_options_${index}`">
                    <div class="flex justify-between min-w-32">
                      <span>{{ resolveLabel(el) }}</span>
                      <span>{{ Math.floor(resolveValue(configurables[key], el) * 100) }}%</span>
                    </div>
                    <Clickable class="interactable-styling">
                      <input 
                        class="thin-slider"
                        tabindex="1"
                        type="range"
                        name="volume"
                        min="0" 
                        max="1" 
                        step="0.05"
                        v-model.number="localAudio[el as keyof IAudioConfiguration]"
                        @input="() => saveOnUpdate(el)"
                      />
                    </Clickable>
                    <Clickable v-if="el !== 'bgm'" class="interactable-styling"><button  @click="testAudio(el)" tabindex="1" class="min-w-8">Test</button></Clickable>
                    <div v-else class="min-w-8"></div>
                  </div>
                </template>
                <template v-if="key === 'text'">
                  <div v-for="(el, index) in Object.keys(configurables[key])" class="flex justify-around mx-4" :key="`text_options_${index}`">
                    <div class="flex justify-between min-w-72">
                      <span>{{ resolveLabel(el) }}</span>
                      <span>{{ speedIndex[(resolveValue(configurables[key], el) * 5) -1 ] }}</span>
                    </div>
                    <Clickable class="interactable-styling">
                      <input 
                        class="thin-slider"
                        tabindex="1"
                        type="range"
                        name="speed"
                        min="0.2" 
                        max="1" 
                        step="0.2"
                        v-model.number="localText[el as keyof ITextConfiguration]"
                      />
                    </Clickable>
                  </div>
                </template>
              </template>
            </div>
          </section>
        </div>
        <div>
          <div class="flex justify-end">
            <Clickable class="interactable-styling"><button @click="handleGameReset()">Reset Game Progress</button></Clickable>
          </div>
          <div class="min-h-[20%]">
            <section class='flex flex-col items-center px-8 py-4 h-full bg-slate-600/50 rounded-2xl glass relative'>
              <h3 class="text-3xl min-h-8 transition-all text-orange-400">{{testingText.speaker}}</h3>
              <p class="reveal">
                <span :class="[
                  { '!bg-100_100 !duration-[max(var(--dynamicDuration),_500ms)]' : trigger },
                  { '[&>span>ruby]:text-opacity-100': trigger && timer },
                  { '[&>span>ruby]:!duration-0 [&>span>ruby]:!delay-0': !timer },
                  { '[&>span>ruby>rt]:text-opacity-100': trigger && timer },
                  { '[&>span>ruby>rt]:!duration-0 [&>span>ruby>rt]:!delay-0': !timer },
                  ]"
                  :style="{'--dynamicDuration': `${transitionDuration}ms`}"
                  v-html="testingText.text"></span>
              </p>
              <LoaderIcon 
                class="absolute right-0 bottom-0 mr-4 mb-4 animate-spin [animation-duration:_3s]"
              />
            </section>
          </div>
        </div>
      </div>
      <Versioning v-if="!(props.routeless)"/>
    </div>
  </div>
</template>
<style>
  input[type=range].thin-slider{
    @apply appearance-none;
    @apply bg-transparent;
  }

  input[type=range].thin-slider:focus,
  input[type=range].thin-slider:hover{
    @apply outline-none;
  }

  input[type=range].thin-slider{
    &::-webkit-slider-runnable-track{
      @apply bg-orange-300;
      @apply h-1;
      @apply shadow-none border-none;
    }
    &::-moz-range-track{
      @apply bg-orange-300;
      @apply h-1;
      @apply shadow-none border-none;
    }
  }

  input[type=range].thin-slider{
    &::-webkit-slider-thumb{
      @apply appearance-none;

      @apply bg-orange-400/80;
      @apply shadow-none border-none;
      @apply h-4 w-1.5;
      @apply rotate-[30deg];
      @apply -mt-1.5;
    }
    &::-moz-range-thumb{
      @apply appearance-none;

      @apply bg-orange-400/80;
      @apply shadow-none border-none;
      @apply h-4 w-1.5;
      @apply rotate-[30deg];
    }
  }
</style>

<style scoped>
  .interactable-styling{
     > * {
      &:focus-visible, &:hover {
        @apply text-rose-400;
      }
      &:focus-visible, &:focus {
        @apply !outline-none;
      }
    }
    > input[type=range].thin-slider {
      &:focus-visible, &:hover{
        &::-webkit-slider-thumb{
          @apply !bg-rose-400;
        }
        &::-moz-range-thumb{
          @apply !bg-rose-400;
        }

        &::-webkit-slider-runnable-track{
          @apply !bg-rose-400;
        }
        &::-moz-range-track{
          @apply !bg-rose-400;
        }
      }
    }
  }
</style>