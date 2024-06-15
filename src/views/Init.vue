
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
  const interval = 4000;
  // duration            1000   |  2000  | 1000 
  // timings             1000   |  3000  | 4000
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
    }, ((interval * i) + 3000));
    setTimeout(() => {
      val.state = "off";
    }, ((interval * i) + 4000));
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
      <div class="max-w-[1000px]">
        <p>This product is brought to you by BLAH</p>
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
      <div class="max-w-[1000px]">
        <p>Foo Bar Baz</p>
      </div>
    </article>
  </section>
</template>

