<script setup lang="ts">
  import videoSrc from '@assets/bg-audio.mp4';
  import Backdrop from '@components/Backdrop.vue';
  import Overlay from '@components/Overlay.vue';
  import { IText } from '@stores/interfaces';
  import { useScriptEngine } from '@stores/scriptEngine';
  import { nextTick, ref } from 'vue';

  const scriptEngine = useScriptEngine()

  const triggerToggle = ref(false);
  const textInstance = ref<IText>({
    text: '',
    speaker: '',
    position: 'center',
    voice: '',
  });

  console.log(scriptEngine.$getScene());

  scriptEngine.$onAction((el)=> {
    const startTime = Date.now()
    el.onError((error) => {
      console.warn(
        `Failed "${el.name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })

    if (el.name === '_updateBgm'){
      console.log(el);
      el.after((result) => {
        console.log('update BGM: \t' + JSON.stringify(el.args));
      })
    }

    if (el.name === '_updateBackdrop'){
      console.log(el);
      el.after((result) => {
        console.log('update Backdrop: \t' + JSON.stringify(el.args));
      })
    }

    if (el.name === '_updateChars'){
      console.log(el);
      el.after((result) => {
        console.log('update Chars: \t' + JSON.stringify(el.args));
      })
    }

    if (el.name === '_updateText'){
      console.log(el);
      el.after((result) => {
        textInstance.value = scriptEngine.$getScene();
        console.log('update Text: \t' + JSON.stringify(el.args));
      })
    }

    if (el.name === '_updateTransitions'){
      console.log(el);
      el.after((result) => {
        console.log('update Transitions: \t' + JSON.stringify(el.args));
      })
    }

    if (el.name === '_updateTransition'){
      console.log(el);
      el.after((result) => {
        triggerToggle.value = false;
        textInstance.value = scriptEngine.$getScene();
        setTimeout((() => triggerToggle.value = true),300);
        console.log('update Transition: \t' + JSON.stringify(el.args));
      })
    }

  });


</script>

<template>
  <div class="animate-fadeIn">
    <div class='grid [grid-template-areas:_"stack"] *:[grid-area:_stack]'>
      <!-- Backdrop -->
      <Backdrop
        :isVideo="true"
        :contentSrc="videoSrc"
        contentType="video/mp4"
      />
      <!-- Interactions / char layer -->
      <section>foooo</section>
      <button @click="() => triggerToggle = !triggerToggle" class="px-4 py-2 bg-white text-black rounded h-fit w-fit z-[11]">poke</button>
      <!-- Overlay -->
      <Overlay  
        :text="textInstance.text"
        :speaker="textInstance.speaker"
        :trigger="triggerToggle"
      />
    </div>
  </div>
</template>

