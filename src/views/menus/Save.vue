<script setup lang="ts">
  import { ref } from 'vue';
  import Clickable from '@components/Clickable.vue';
  import ConfirmDialog from '@components/ComfirmDialog.vue';
  import InputDialog from '@components/InputDialog.vue';
  import SceneCard from '@components/SceneCard.vue';
  import videoSrc from '@assets/video/bg-menu.mp4';
  import { useScriptEngine } from '@stores/scriptEngine';
  import {
    CloseIcon,
  } from '@components/icon';

  const MAX_SAVES = 10;

  interface Props {
    routeless?: boolean,
  }
  const props = defineProps<Props>()

  const $emit = defineEmits(['close'])

  interface ISaveDialogData {
    index: number
  }

  const allSaves = ref<ISave[]>(new Array<ISave>(MAX_SAVES));
  const showingConfirmDialog = ref(false);
  const showingSaveDialog = ref(false);
  const saveDialogData = ref<null | ISaveDialogData>(null);
  const confirmDialogData = ref<any>();

  const scriptEngine = useScriptEngine();

  function handleClose(){
    if (props.routeless){
      $emit('close');
    }
  }

  interface ISave {
    title: string,
    chapterIndex: number | string,
    sceneIndex: number | string,
    transitionIndex: number | string,
    active?: boolean,
  }

  const demoSaves = Object.freeze([
    { 
      title: 'test save 1',
      chapterIndex: 1,
      sceneIndex: 2,
      transitionIndex: 0,
      active: true,
    },
    { 
      title: 'test save 2',
      chapterIndex: 2,
      sceneIndex: 1,
      transitionIndex: 0,
      active: true,
    },
    { 
      title: 'foo bar ',
      chapterIndex: 1,
      sceneIndex: 3,
      transitionIndex: 0,
      active: true,
    },
    { 
      title: 'baz arraz',
      chapterIndex: 0,
      sceneIndex: 3,
      transitionIndex: 0,
      active: true,
    },
    { 
      title: 'double save??',
      chapterIndex: 0,
      sceneIndex: 3,
      transitionIndex: 0,
      active: true,
    },
  ]) as ISave[]

  allSaves.value = [...demoSaves];

  if (!(allSaves.value.length >= MAX_SAVES)){
    allSaves.value.length = MAX_SAVES;
    const savesUsed = demoSaves.length;
    const defaultSave: ISave =  { 
      title  : 'New Save',
      chapterIndex: '',
      sceneIndex  : '',
      transitionIndex: '',
      active : false,
    }
    allSaves.value?.fill( {...defaultSave}, savesUsed , MAX_SAVES);
  }

  function tryToSave(alreadyHasSave: boolean, index: number){
    console.log('am I overwritting', alreadyHasSave);
    if (alreadyHasSave){
      confirmDialogData.value = { index }
      showingConfirmDialog.value = true;
    } else {
      actionSave(index);
    }
  }

  function actionSave(index: number){
    console.log('New Save at index: ', index);
    saveDialogData.value = { index: index };
    showingSaveDialog.value = true;
  }
  function completeSave(data: ISaveDialogData & { input: string } ){
    showingSaveDialog.value = false;
    console.log('User input', data);
    saveDialogData.value = null;

    if (!(data?.index)) return
    
    const saveIndex = data.index

    
    const newSave = {
      title: data.input,
      active : true,
      ...scriptEngine.getSaveData,
    }
    console.log('newSave: ', newSave);

    allSaves.value[saveIndex] = {...newSave};
  }

</script>

<template>
  <div class="animate-fadeIn" @click.stop>
    <InputDialog 
      message="This will overwrite your existing save, Are you sure you wish to overwrite this?"
      :data="saveDialogData"
      :show="showingSaveDialog"
      @close-ok="(e) => {showingSaveDialog = false; completeSave(e);}"
      @close-cancel="showingSaveDialog = false"
    />
    <ConfirmDialog 
      message="This will overwrite your existing save, Are you sure you wish to overwrite this?"
      :show="showingConfirmDialog"
      :data="confirmDialogData"
      @close-ok="(e) => {showingConfirmDialog = false; actionSave(e.index);}"
      @close-cancel="showingConfirmDialog = false"
    />
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
      <div>
        <section class="flex justify-between">
          <h1>Save</h1>
          <Clickable>
            <article class="absolute top-0 right-0 group mr-5 mt-4" @click="handleClose()">
              <CloseIcon class="group-hover:stroke-orange-500 tranition-colors duration-300 scale-150"/>
            </article>
          </Clickable>
        </section>
        <section class='grid grid-cols-2 gap-20 p-10' :data-modalOpen="showingConfirmDialog || showingSaveDialog">
          <div v-for="(save, index) in allSaves">
            <SceneCard
              :chapter="save.chapterIndex"
              :scene="save.sceneIndex"
              :title="save.title"
              :disabled="false"
              @click="tryToSave(save.active || false, index)"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>