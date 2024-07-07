<script setup lang="ts">
import Clickable from './Clickable.vue';

  const DEFAULT_BG = '/backdrop/saves/default (Medium).png';
  const SAVES_BG = Object.freeze([
  '/backdrop/saves/chapter-1 (Medium).jpg',
  '/backdrop/saves/chapter-2 (Medium).jpg',
  '/backdrop/saves/chapter-3 (Medium).jpg',
  ])as string[];

  interface Props {
    chapter: string | number,
    scene: string | number,
    title: string,
    disabled: boolean,
  }
  const props = defineProps<Props>()

  function bgSrc(){
    if (props.chapter !== '' && Number(props.chapter) <= SAVES_BG.length){
      return SAVES_BG[Number(props.chapter)]
    } else {
      return DEFAULT_BG;
    }
  }

</script>

<template>
  <article class="*:px-4">
    <template v-if="!(props.disabled)">
      <Clickable :inline="false">
        <div class='flex bg-slate-600/80 rounded-xl gap-5 overflow-hidden hover:scale-110 transition-all duration-300 inert'>
          <img 
            :src="bgSrc()" 
            class="max-w-[150px] w-[150px] aspect-16/9"
          >
          <div class="flex flex-col justify-around">
            <span>{{ props.title }}</span>
            <span>Chapter: {{`${props.chapter}` !== '' ? Number(props.chapter) + 1 : 'TBD' }}</span>
            <span>Scene: {{ `${props.scene}` !== '' ? Number(props.scene) + 1 : 'TBD'  }}</span>
          </div>
        </div>
      </Clickable>
    </template>
    <div v-else class="flex flex-col gap-4 bg-slate-600/80 rounded-xl">
      <span class="max-w-[150px] w-[150px] aspect-16/9">TBD</span>
    </div>
  </article>
</template>

<style>
  [data-modalOpen="true"] .inert{
    pointer-events: none !important;
  }
</style>
