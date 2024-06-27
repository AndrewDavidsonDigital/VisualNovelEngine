<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import videoSrc from '@assets/video/bg-audio.mp4';
  import { useConfiguration, IConfiguration, IAudioConfiguration, labelMap_EN } from '@stores/configuration';
  import { 
    useBgmEngine, 
    useSfxEngine,
    useVoiceEngine,
  } from '&audio'

  const bgmEngine = useBgmEngine()
  const sfxEngine = useSfxEngine()
  const voiceEngine = useVoiceEngine()

  const config = useConfiguration()

  const configurables = config.getConfigurables();
  const localAudio = ref<IAudioConfiguration>(configurables.audio);

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
            <RouterLink to="/menu"><h1>Save</h1></RouterLink>
            <RouterLink to="/menu"><h1>Back</h1></RouterLink>
          </span>
        </section>
        <section class='grid grid-cols-4'>
          <div v-for="(key) in Object.keys(configurables)">
            <h2 class="text-xl">{{resolveLabel(key)}}</h2>
            <template v-if="isItterable(configurables[key as keyof IConfiguration])">
              <template v-if="key === 'audio'">
                <div v-for="(el) in Object.keys(configurables[key as keyof IConfiguration])" class="flex justify-around mx-4">
                  <div class="flex justify-between min-w-32">
                    <span>{{ resolveLabel(el) }}</span>
                    <span>{{ Math.floor(resolveValue(configurables[key as keyof IConfiguration], el) * 100) }}%</span>
                  </div>
                  <input 
                    type="range"
                    id="volume"
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
            </template>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

