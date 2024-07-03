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

  const allSaves = ref<ISave[]>(new Array<ISave>(MAX_SAVES));
  const showingConfirmDialog = ref(false);
  const showingSaveDialog = ref(false);
  const confirmDialogData = ref<any>();

  const scriptEngine = useScriptEngine();

  function handleClose(){
    if (props.routeless){
      $emit('close');
    }
  }

  interface ISave {
    title: string,
    chapter: number | string,
    scene: number | string,
    active?: boolean,
  }

  const demoSaves = Object.freeze([
    { 
      title: 'test save 1',
      chapter: 1,
      scene: 2,
      active: true,
    },
    { 
      title: 'test save 2',
      chapter: 2,
      scene: 1,
      active: true,
    },
    { 
      title: 'foo bar ',
      chapter: 1,
      scene: 3,
      active: true,
    },
    { 
      title: 'baz arraz',
      chapter: 3,
      scene: 3,
      active: true,
    },
    { 
      title: 'double save??',
      chapter: 3,
      scene: 3,
      active: true,
    },
  ]) as ISave[]

  allSaves.value = [...demoSaves];

  if (!(allSaves.value.length >= MAX_SAVES)){
    allSaves.value.length = MAX_SAVES;
    const savesUsed = demoSaves.length;
    const defaultSave: ISave =  { 
      title  : 'New Save',
      chapter: '',
      scene  : '',
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
    const newSave = {...scriptEngine.getSaveData}
    console.log('New Save at index: ', index);
    console.log('newSave: ', newSave);
    showingSaveDialog.value = true;
  }
  function completeSave(data: any){
    showingSaveDialog.value = false;
    console.log('User input', data);
  }

</script>

<template>
  <div class="animate-fadeIn" @click.stop>
    <InputDialog 
      message="This will overwrite your existing save, Are you sure you wish to overwrite this?"
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
            <!-- Save Card -->
            <SceneCard
              :chapter="save.chapter"
              :scene="save.scene"
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