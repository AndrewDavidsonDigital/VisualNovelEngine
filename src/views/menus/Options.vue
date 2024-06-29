<script setup lang="ts">
  import { nextTick, ref, watch, onBeforeUnmount } from 'vue'
  import videoSrc from '@assets/video/bg-audio.mp4';
  import { useConfiguration, IConfiguration, IAudioConfiguration, labelMap_EN, ITextConfiguraion } from '@stores/configuration';
  import { 
    useBgmEngine, 
    useSfxEngine,
    useVoiceEngine,
  } from '&audio'
  import { LoaderIcon } from '@components/icon'

  const bgmEngine = useBgmEngine()
  const sfxEngine = useSfxEngine()
  const voiceEngine = useVoiceEngine()

  const config = useConfiguration()

  const configurables = config.getConfigurables();
  const localAudio = ref<IAudioConfiguration>(configurables.audio);
  const localText = ref<ITextConfiguraion>(configurables.text);

  const testingText = Object.freeze({
    speaker: 'Foo Bar',
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

  function isItterable(thing: any): boolean{
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
      console.log(`unable to resolve value for key: '${key}' in collection: ${thing}`);
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
        case('bgm'):
          bgmEngine.setVolume(configurables.audio[key]);
          break;
        case('sfx'):
          sfxEngine.setVolume(configurables.audio[key]);
          break;
        case('voice'):
          voiceEngine.setVolume(configurables.audio[key]);
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

  function saveConfiguration(){
    config.$state.audio = {...localAudio.value}
    config.$state.text = {...localText.value}
    config.save();
  }

  const speedIndex = Object.freeze([
    'Slowest',
    'Slower',
    'Average',
    'Faster',
    'Fastest',
  ])

  watch(() => localText.value.displayRatio , () => {
    clearTimer();
    setTransitionDuration();
    restartText();
  })

  watch(() => localText.value.autoWaitRatio , () => {
    clearTimer();
    setAutoPauseDuration();
    // restartText();
  })

  watch(transitionDuration, () => {
    resetTimer();
  })

  watch(autoDuration, () => {
    resetTimer();
  })

  function setAutoPauseDuration(){
    const newValue = 500 / localText.value.autoWaitRatio;
    console.log(`setAutoPauseDuration: ${newValue}`)
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
    console.log(`\t: creating timeout for ${durr}`);
    const id = setTimeout(() => {
      timer.value = true;
      timerId_display.value = -1;
      console.log(`\t\t: auto in "${autoDuration.value}"`);
      const id = setTimeout(() => {
        console.log('\t\t: auto done');
        restartText();
      }, autoDuration.value);
      timerId_auto.value = id;
    }, durr);
    timerId_display.value = id;
  }

  function restartText(){
    trigger.value = false;
    setTimeout(() => {
      trigger.value = true;
      resetTimer();
    }, 50);
  }

  restartText();

  // ensure timers are destroyed
  onBeforeUnmount(() => {
    clearTimer();
  });

</script>

<template>
  <div class="animate-fadeIn">
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
      <div class='mx-8 my-4 p-4 aspect-video z-10 bg-slate-500/50 rounded-xl'>
        <section class="flex justify-between">
          <h1>Options</h1>
          <span class="flex gap-2">
            <RouterLink to="/menu" @click="saveConfiguration"><h1>Save</h1></RouterLink>
            <RouterLink to="/menu"><h1>Back</h1></RouterLink>
          </span>
        </section>
        <section class='grid grid-cols-2'>
          <div v-for="(key) in Object.keys(configurables)">
            <h2 class="text-xl">{{resolveLabel(key)}}</h2>
            <template v-if="isItterable(configurables[key as keyof IConfiguration])">
              <template v-if="key === 'audio'">
                <div v-for="(el) in Object.keys(configurables[key])" class="flex justify-around mx-4">
                  <div class="flex justify-between min-w-32">
                    <span>{{ resolveLabel(el) }}</span>
                    <span>{{ Math.floor(resolveValue(configurables[key], el) * 100) }}%</span>
                  </div>
                  <input 
                    type="range"
                    name="volume"
                    min="0" 
                    max="1" 
                    step="0.05"
                    v-model.number="localAudio[el as keyof IAudioConfiguration]"
                    @input="() => saveOnUpdate(el)"
                  />
                  <button @click="testAudio(el)" :disabled="el === 'bgm'">Test</button>
                </div>
              </template>
              <template v-if="key === 'text'">
                <div v-for="(el) in Object.keys(configurables[key])" class="flex justify-around mx-4">
                  <div class="flex justify-between min-w-72">
                    <span>{{ resolveLabel(el) }}</span>
                    <span>{{ speedIndex[(resolveValue(configurables[key], el) * 5) -1 ] }}</span>
                  </div>
                  <input 
                    type="range"
                    name="speed"
                    min="0.2" 
                    max="1" 
                    step="0.2"
                    v-model.number="localText[el as keyof ITextConfiguraion]"
                  />
                </div>
              </template>
            </template>
          </div>
        </section>
        <div class="min-h-[20%]">
          <section class='flex flex-col items-center px-8 py-4 h-full bg-slate-600/50 rounded-2xl glass'>
            <h3 class="text-3xl min-h-8 transition-all text-orange-400">{{testingText.speaker}}</h3>
            <p class="reveal">
              <span :class="[
                { '!bg-100_100 !duration-[max(var(--dynamicDuartion),_500ms)]' : trigger },
                { '[&>span>ruby]:text-opacity-100': trigger && timer },
                { '[&>span>ruby]:!duration-0 [&>span>ruby]:!delay-0': !timer },
                { '[&>span>ruby>rt]:text-opacity-100': trigger && timer },
                { '[&>span>ruby>rt]:!duration-0 [&>span>ruby>rt]:!delay-0': !timer },
                ]"
                :style="{'--dynamicDuartion': `${transitionDuration}ms`}"
                v-html="testingText.text"></span>
            </p>
            <LoaderIcon 
              class="absolute right-0 bottom-0 mr-4 mb-4 animate-spin [animation-duration:_3s]"
            />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

