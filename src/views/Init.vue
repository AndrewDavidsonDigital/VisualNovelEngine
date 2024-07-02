
<script setup lang="ts">
  import router from '../router';
  import { ref } from 'vue'
  import { useBgmEngine } from '&audio'

  // flow: off -> in -> static -> out -> off
  type LayerState = "in" | "out" | "static" | "off"
  interface ILayer {
    state: LayerState,
  }
  
  let layers = ref<ILayer[]>([{ state: "in" }, { state: "off"}])
  let activeLayer = ref(0)
  const interval = 6000;
  // duration            1000   |  4000  | 1000 
  // timings             1000   |  5000  | 6000
  // flow:    off -> in   -> static ->  out  -> off

  // iterate and create timers per layer
  layers.value.forEach((val, i) => {
    if (i !== 0){
      setTimeout(() => {
        val.state = "in";
        activeLayer.value = i;
      }, (interval * i));
    }
    setTimeout(() => {
      val.state = "static";
    }, ((interval * i) + 1000));
    setTimeout(() => {
      val.state = "out";
    }, ((interval * i) + 5000));
    setTimeout(() => {
      val.state = "off";
    }, ((interval * i) + 6000));
  });

  // scene transition timer
  setTimeout(() => {
    router.push({name: 'landing'});
  }, (500 + (interval * layers.value.length)));

  const bgmEngine = useBgmEngine();
  bgmEngine.restart();

</script>

<template>
  <section class="bg-black text-white">
    <article 
      v-if="activeLayer === 0"
      :class="[
        'flex flex-col justify-around items-center',
        'h-full opacity-0',
        { 'animate-fadeIn' : layers[0].state === 'in' },
        { 'opacity-100'    : layers[0].state === 'static' },
        { 'animate-fadeOut': layers[0].state === 'out' },
        { 'opacity-0'      : layers[0].state === 'off' },
        ]"
    >
      <div class="max-w-[1000px] *:text-lg *:text-gray-500">
        <p>This product is brought to you by Indexes out of Bounds & segmentation faults</p>
      </div>
    </article>
    <article 
      v-if="activeLayer === 1"
      :class="[
        'flex flex-col justify-around items-center',
        'h-full opacity-0',
        { 'animate-fadeIn' : layers[1].state === 'in' },
        { 'opacity-100'    : layers[1].state === 'static' },
        { 'animate-fadeOut': layers[1].state === 'out' },
        { 'opacity-0'      : layers[1].state === 'off' },
        ]"
    >
      <div class="max-w-[1000px] text-center  *:text-lg *:text-gray-500">
        <p class="pb-2">WARNING: PHOTOSENSITIVITY/EPILEPSY SEIZURES</p>
        <p>A very small percentage of people may experience epileptic seizures or blackouts when exposed to certain kinds of flashing lights or light patterns. These persons, or even people who have no history of seizures or epilepsy, may experience epileptic symptoms or seizures while playing video games. If you or any of your relatives has an epileptic condition or has had seizures of any kind, consult your physician before playing any video game.</p>
      </div>
    </article>
  </section>
</template>

