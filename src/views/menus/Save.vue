<script setup lang="ts">
  import { ref } from 'vue';
  import Clickable from '@components/Clickable.vue';
  import ConfirmDialog from '@components/Dialogs/ConfirmDialog.vue';
  import InputDialog from '@components/Dialogs/InputDialog.vue';
  import SceneCard from '@components/SceneCard.vue';
  import videoSrc from '@assets/video/bg-menu.mp4';
  import { innerClickEvent } from '@lib/mouse';
  import { useScriptEngine } from '@stores/scriptEngine';
  import {
    CloseIcon,
  } from '@components/icon';
  import { trace } from '@lib/logging';
  import { useStorage } from '@lib/storage';

  const LOGGING_PREFIX = '💾 SAVE/LOAD:\t';

  const stateStorage = useStorage();
  const MAX_SAVES = 10;

  interface ISave {
    title: string,
    chapterIndex: number | string,
    sceneIndex: number | string,
    transitionIndex: number | string,
    active?: boolean,
    dateTime: number,
  }

  const defaultSave: ISave =  { 
    title  : 'New Save',
    chapterIndex: '',
    sceneIndex  : '',
    transitionIndex: '',
    active : false,
    dateTime: Date.now(),
  }

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

  // first run check
  const hasSaves = stateStorage.get();

  if (hasSaves === null){
    trace(`${LOGGING_PREFIX} no saves located, instatiating new set`);
    const tempSaves = new Array(MAX_SAVES);
    tempSaves.fill(defaultSave)
    stateStorage.set(JSON.stringify(tempSaves));
  }

  // load existing saves
  const existingSavesJSON = stateStorage.get() || '';


  function handleClose(){
    if (props.routeless){
      $emit('close');
    }
  }

  allSaves.value = JSON.parse(existingSavesJSON);
  function tryToSave(alreadyHasSave: boolean, index: number){
    trace(`${LOGGING_PREFIX}am I overwritting: ${alreadyHasSave}`);
    if (alreadyHasSave){
      confirmDialogData.value = { index }
      showingConfirmDialog.value = true;
    } else {
      actionSave(index);
    }
  }

  function actionSave(index: number){
    trace(`${LOGGING_PREFIX}New Save at index: ${index}`);
    saveDialogData.value = { index: index };
    showingSaveDialog.value = true;
  }

  function completeSave(data: ISaveDialogData & { input: string } ){
    showingSaveDialog.value = false;
    trace(`${LOGGING_PREFIX}User input: ${data}`);
    saveDialogData.value = null;

    if (!(data?.index) && data.index !== 0) return
    
    const saveIndex = data.index

    
    const newSave = {
      title: data.input,
      active : true,
      ...scriptEngine.getSaveData,
      dateTime: Date.now(),
    }
    trace(`${LOGGING_PREFIX}newSave: ${newSave}`);

    allSaves.value[saveIndex] = {...newSave};

    commitSaves();
  }

  function commitSaves(){
    trace(`${LOGGING_PREFIX}saving data updated`);
    // trace(`${LOGGING_PREFIX}SAVEDATA: ${JSON.stringify(allSaves.value)}`);
    stateStorage.set(JSON.stringify(allSaves.value));
  }

</script>

<template>
  <div class="animate-fadeIn" @click.stop="(event: MouseEvent) => innerClickEvent(event)">
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