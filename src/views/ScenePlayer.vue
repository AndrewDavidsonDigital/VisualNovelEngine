<script setup lang="ts">
  import defaultVideoSrc from '@assets/video/bg-game-default.mp4';
  import Backdrop from '@components/Backdrop.vue';
  import Overlay from '@components/layers/Overlay.vue';
  import { IBackdrop, IChar, IText } from '@stores/interfaces';
  import { useScriptEngine } from '@stores/scriptEngine';
  import { ref, watch } from 'vue';
  import { 
    useBgmEngine,
    useSfxEngine,
    useVoiceEngine,
  } from '&audio';
  import Characterlay from '@components/layers/Characterlay.vue';
  import Effectslay from '@components/layers/Effectslay.vue';
  import { trace } from '@lib/logging';
  const LOGGING_PREFIX = '🖼️ScenePlayer:\t';

  const scriptEngine = useScriptEngine()
  const bgmEngine = useBgmEngine();
  const sfxEngine = useSfxEngine();
  const voiceEngine = useVoiceEngine();

  const videoSrc = ref(defaultVideoSrc);
  const isBackdropVideo = ref(true);

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
  const ImageMimeExtensions = Object.freeze([
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
  const SUPPORTERD_MIMES: ISupportedMimes = Object.freeze({
    '.mp4': 'video/mp4',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  })

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

  /******************************Scripture Reactionary functions****************************************/

  scriptEngine.$onAction((el)=> {
    const startTime = Date.now()
    el.onError((error) => {
      console.warn(
        `Failed "${el.name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })

    if (el.name === '_updateBgm'){
      el.after((result) => {
        trace(`${LOGGING_PREFIX}update BGM: \t${JSON.stringify(el.args)}` );
        bgmEngine.fadeOut();
        setTimeout((() => {
          bgmEngine.setTrack(scriptEngine.getSceneBGM.path);
          bgmEngine.fadeUp();
        }),1000);
      })
    }

    if (el.name === '_updateBackdrop'){
      el.after((result) => {
        backdropInstance.value = scriptEngine.getSceneBackdrop;
        trace(`${LOGGING_PREFIX}update Backdrop: \t${JSON.stringify(el.args)}` );
      })
    }

    if (el.name === '_updateChars'){
      el.after((result) => {
        charInstance.value = scriptEngine.getSceneChars;
        trace(`${LOGGING_PREFIX}update Chars: \t${JSON.stringify(el.args)}` );
      })
    }

    if (el.name === '_updateText'){
      el.after((result) => {
        triggerToggle.value = false;
        textInstance.value = scriptEngine.getSceneText;
        setTimeout((() => triggerToggle.value = true),300);
        trace(`${LOGGING_PREFIX}update Text: \t${JSON.stringify(el.args)}` );
      })
    }

    // if (el.name === '_updateTransitions'){
    //   el.after((result) => {
    //     trace(`${LOGGING_PREFIX}update Transitions: \t${JSON.stringify(el.args)}` );
    //   })
    // }

    if (el.name === '_updateTransition'){
      el.after((result) => {
        triggerToggle.value = false;
        textInstance.value = scriptEngine.getSceneText;
        setTimeout((() => triggerToggle.value = true),300);
        trace(`${LOGGING_PREFIX}update Transition: \t${JSON.stringify(el.args)}` );
      })
    }
  });

  /*****************************************************************************************************/

  function handleProgress(){
    triggerToggle.value = !(triggerToggle.value);
    scriptEngine.progress();
  }

  function skipScene(){
    triggerToggle.value = !(triggerToggle.value);
    setTimeout((() => triggerToggle.value = true),300);
    scriptEngine.skipFowards();
  }

  function resolveMimeType () {
    const extension = videoSrc.value.substring(videoSrc.value.lastIndexOf('.')); // result will incldue the period
    // trace(`${LOGGING_PREFIX}ext =  ${extension}` );
    if (SUPPORTERD_MIMES.hasOwnProperty(extension)){
      return SUPPORTERD_MIMES[extension as keyof ISupportedMimes];
    }
    return '.mp4'
  }
  handleProgress();


  function toggleEffects(toggleTo: boolean){
    visibleEffectsToggle.value = !toggleTo;
  }


  function firstRun(){

    backdropInstance.value = scriptEngine.getSceneBackdrop;
    trace(`${LOGGING_PREFIX}:::: ${JSON.stringify(scriptEngine.getSceneText)}` );
    textInstance.value = scriptEngine.getSceneText;

    resolveMimeType();
  }

  setTimeout( () => firstRun(), 500);

</script>

<template>
  <div class="animate-fadeIn">
    <div class='grid [grid-template-areas:_"stack"] *:[grid-area:_stack] overflow-hidden  w-fit'>
      <!-- Backdrop (AKA Background Layer) -->
      <Backdrop
        :isVideo="isBackdropVideo"
        :contentSrc="videoSrc"
        :contentType="resolveMimeType()"
      />
      <!-- Interactions / Effects Layer -->
      <Effectslay 
        effect="off" 
        :data-attributes="['animateLeft', 'animateRight']"
        :visible="visibleEffectsToggle"
      />
      <!-- char layer -->
      <Characterlay
        :characters="charInstance"
      />
      <!-- Overlay -->
      <Overlay  
        :text="textInstance.text"
        :speaker="textInstance.speaker"
        :trigger="triggerToggle"
        @skip="() => skipScene()"
        @progress="() => handleProgress()"
        @toggle-backdrop="(toggleTo) => toggleEffects(toggleTo)"
      />
    </div>
  </div>
</template>

