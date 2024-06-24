<script setup lang="ts">
  import videoSrc from '@assets/bg-audio.mp4';
  import Backdrop from '@components/Backdrop.vue';
  import Overlay from '@components/Overlay.vue';
  import { useScriptEngine } from '@stores/scriptEngine';

  const scriptEngine = useScriptEngine()

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
        console.log('update Text: \t' + JSON.stringify(el.args));
      })
    }

    if (el.name === '_updateTransitions'){
      console.log(el);
      el.after((result) => {
        console.log('update Transitions: \t' + JSON.stringify(el.args));
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
      <!-- Overlay -->
      <Overlay />
    </div>
  </div>
</template>

