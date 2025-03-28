<script setup lang="ts">
  // import defaultVideoSrc from '@assets/video/bg-game-default.mp4';
  import Backdrop from '@components/Backdrop.vue';
  import Overlay from '@components/layers/Overlay.vue';
  import { IBackdrop, IChar, IChoice, IText } from '@stores/interfaces';
  import { useScriptEngine } from '@stores/scriptEngine';
  import { ref, watch } from 'vue';
  import { 
    useBgmEngine,
    useSfxEngine,
    useVoiceEngine,
  } from '&audio';
  import Characterlay from '@components/layers/Characterlay.vue';
  import Effectslay, { EffectExtraDataType, EffectType } from '@components/layers/Effectslay.vue';
  import { trace } from '@lib/logging';
  import { useCurrentGame } from '@lib/storage';
  import Versioning from '../Versioning.vue'
  const LOGGING_PREFIX = '🖼️ScenePlayer:\t';



  /**********************************Initialisation********************************************/  

  const scriptEngine = useScriptEngine()
  const bgmEngine = useBgmEngine();
  const _sfxEngine = useSfxEngine();
  const voiceEngine = useVoiceEngine();

  const currentGame = useCurrentGame();
  const decisions = ref<string[]>([]);

  const videoSrc = ref('');
  const isBackdropVideo = ref(true);

  const effectName = ref<EffectType>('off')
  const effectExtraData = ref<EffectExtraDataType>();

  const backdropInstance = ref<IBackdrop>({
    path: '',
    type: 'video',
  });


  const visibleEffectsToggle = ref(true);
  const triggerToggle = ref(false);
  const textInstance = ref<IText>({
    text: '',
    speaker: '',
    position: 'center',
    voice: '',
  });

  const charInstance = ref<IChar[]>([{
    path: '', 
    positioning: 'center',
  }]);

  const VideoMimeExtensions = Object.freeze([
    '.mp4'
  ])
  const _ImageMimeExtensions = Object.freeze([
  '.webp',
  '.png',
  '.jpg',
  ])

  interface ISupportedMimes {
    '.mp4': string;
    '.webp': string;
    '.png': string;
    '.jpg': string,
  }
  const SUPPORTED_MIMES: ISupportedMimes = Object.freeze({
    '.mp4': 'video/mp4',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  })


  /******************************************************************************/

  watch(backdropInstance, () => {
    videoSrc.value = backdropInstance.value.path;
    const ext = videoSrc.value.substring(videoSrc.value.lastIndexOf('.'));

    isBackdropVideo.value = VideoMimeExtensions.indexOf(ext) !== -1
  })

  watch(textInstance, () => {
    if (textInstance.value.voice && textInstance.value.voice !== ''){
      voiceEngine.setAndPlay(textInstance.value.voice);
    }
  })

  /****************************** ScriptEngine Reactionary functions****************************************/

  scriptEngine.$onAction((el)=> {
    const startTime = Date.now()
    trace(`${LOGGING_PREFIX} $onAction: \t${el.name}` );
    el.onError((error) => {
      console.warn(
        `Failed "${el.name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })

    if (el.name === '_updateBgm'){
      el.after((_result) => {
        trace(`${LOGGING_PREFIX}update BGM: \t${JSON.stringify(el.args)}` );
        bgmEngine.fadeOut();
        setTimeout((() => {
          bgmEngine.setTrack(scriptEngine.getSceneBGM.path);
          bgmEngine.fadeUp();
        }),1000);
      })
    }

    else if (el.name === '_updateBackdrop'){
      el.after((_result) => {
        backdropInstance.value = scriptEngine.getSceneBackdrop;
        trace(`${LOGGING_PREFIX}update Backdrop: \t${JSON.stringify(el.args)}` );
      })
    }

    else if (el.name === '_updateChars'){
      el.after((_result) => {
        charInstance.value = scriptEngine.getSceneChars;
        trace(`${LOGGING_PREFIX}update Chars: \t${JSON.stringify(el.args)}` );
      })
    }

    else if (el.name === '_updateText'){
      el.after((_result) => {
        triggerToggle.value = false;
        textInstance.value = scriptEngine.getSceneText;
        setTimeout((() => triggerToggle.value = true),300);
        trace(`${LOGGING_PREFIX}update Text: \t${JSON.stringify(el.args)}` );
      })
    }

    // else if (el.name === '_updateTransitions'){
    //   el.after((result) => {
    //     trace(`${LOGGING_PREFIX}update Transitions: \t${JSON.stringify(el.args)}` );
    //   })
    // }

    else if (el.name === '_updateTransition'){
      el.after((_result) => {
        triggerToggle.value = false;
        textInstance.value = scriptEngine.getSceneText;
        setTimeout((() => triggerToggle.value = true),300);
        trace(`${LOGGING_PREFIX}update Transition: \t${JSON.stringify(el.args)}` );
      })
    }

    else if (el.name === '_updateEffect'){
      el.after((_result) => {
        effectName.value = el.args[0] as EffectType;
        if (el.args[1] && el.args[1] !== null){
          effectExtraData.value = el.args[1] as EffectExtraDataType;
        } else {
          effectExtraData.value = undefined
        }
        trace(`${LOGGING_PREFIX}update Effect: \t${JSON.stringify(el.args)}` );
      })
    }

    else if (el.name === '_loadCallback'){
      el.after((_result) => {
        trace(`${LOGGING_PREFIX}loadCallback: \t${JSON.stringify(el.args)}` );
        // ensure bgm is reset post load.
        bgmEngine.fadeOut();
        setTimeout((() => {
          bgmEngine.setTrack(scriptEngine.getSceneBGM.path);
          bgmEngine.fadeUp();
        }),1000);
        // ensure transition index is correct
        scriptEngine.currentScene.transitionIndex = el.args[0] as number;
      })
    }

    else { trace(`${LOGGING_PREFIX} OTHER CALL: \t${el.name}` );}

  });

  /*****************************************************************************************************/

  function handleProgress(){
    if (scriptEngine.isChoice){
      return;
    }
    triggerToggle.value = !(triggerToggle.value);
    scriptEngine.progress();
  }

  interface ISelectedChoice{
    key: string;
    value: string;
  }

  interface IGameState {
    choices: ISelectedChoice[];
  }

  function handleChoice(data: IChoice){
    decisions.value.push(data.value);
    scriptEngine.progressChoice(data);
    const currentStateString = currentGame.get();
    let currentSate = {
      choices: []
    } as IGameState;

    if (currentStateString !== null && currentStateString !== '{}'){
      currentSate = JSON.parse(currentStateString) as IGameState;
    }

    const newChoice: ISelectedChoice = {
      key: scriptEngine.currentScene.optionKey,
      value: data.value,
    }
    currentSate.choices.push(newChoice);
    currentGame.$set(currentSate);
  }

  function skipScene(){
    triggerToggle.value = !(triggerToggle.value);
    setTimeout((() => triggerToggle.value = true),300);
    scriptEngine.skipForwards();
  }

  function resolveMimeType () {
    const extension = videoSrc.value.substring(videoSrc.value.lastIndexOf('.')); // result will incldue the period
    trace(`${LOGGING_PREFIX}ext =  ${extension}` );
    if (Object.prototype.hasOwnProperty.call(SUPPORTED_MIMES, extension)){
      return SUPPORTED_MIMES[extension as keyof ISupportedMimes];
    }
    return '.mp4'
  }
  handleProgress();


  function toggleEffects(toggleTo: boolean){
    visibleEffectsToggle.value = !toggleTo;
  }

  /**********************************Initial Boot********************************************/

  function firstRun(){

    backdropInstance.value = scriptEngine.getSceneBackdrop;
    trace(`${LOGGING_PREFIX}:::: ${JSON.stringify(scriptEngine.getSceneText)}` );
    textInstance.value = scriptEngine.getSceneText;

    resolveMimeType();
  }

  setTimeout( () => firstRun(), 500);

</script>

<template>
  <div class="animate-fadeIn !animation-duration-1500">
    <div class='grid grid-stack overflow-hidden  w-fit'>
      <!-- Backdrop (AKA Background Layer) -->
      <Backdrop
        :isVideo="isBackdropVideo"
        :contentSrc="videoSrc"
        :contentType="resolveMimeType()"
      />
      <!-- Interactions / Effects Layer -->
      <Effectslay 
        :effect="effectName" 
        :data-attributes="['animateLeft', 'animateRight']"
        :visible="visibleEffectsToggle"
        :extra-data="effectExtraData"
      />
      <!-- char layer -->
      <Characterlay
        :characters="charInstance"
        :class="[
          { '-order-1' : (effectExtraData?._discriminator === 'IBase' && effectExtraData?.isOverlayingChars) || false },
        ]"
      />
      <!-- Overlay -->
      <Overlay  
        :text="textInstance.text"
        :speaker="textInstance.speaker"
        :trigger="triggerToggle"
        :choices="scriptEngine.getChoices"
        :decisions="decisions"
        @skip="() => skipScene()"
        @progress="() => handleProgress()"
        @toggle-backdrop="(toggleTo) => toggleEffects(toggleTo)"
        @choose="(data) => handleChoice(data)"
      />
      <Versioning />
    </div>
  </div>
</template>

<style scoped>
  .grid-stack {
    @apply [grid-template-areas:_"stack"] *:[grid-area:_stack];
  }
</style>

