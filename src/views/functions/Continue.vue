
<script setup lang="ts">
  import { useScriptEngine } from '@stores/scriptEngine';
  import router from '../../router';
  import { trace } from '@lib/logging';
  import { useStorage } from '@lib/storage';
  const LOGGING_PREFIX = '💾 CONTINUE:\t';

  interface ISave {
    title: string,
    chapterIndex: number | string,
    sceneIndex: number | string,
    transitionIndex: number | string,
    active?: boolean,
    dateTime: number,
  }

  const scriptEngine = useScriptEngine()
  
  const stateStorage = useStorage();

  const storageConfig = JSON.parse((stateStorage.get() || '')) as ISave[];
  // get newest save, based on active AND 
  const lastSave = (storageConfig
    .filter(save => save.active)
    .sort((a,b) => b.dateTime - a.dateTime)
  )[0];
  trace(`${LOGGING_PREFIX}${JSON.stringify(lastSave)}`);

  // logical flow is to set clean indexes and set everything back to 0 to start reading from first index
  // once this is set we can navigate to the player and let it `continue` from where we have just forced it to be
  scriptEngine.reset();
  setTimeout(
    () => {
      scriptEngine.loadGameState(lastSave);
      setTimeout(
        () => {
          router.push('game');
        },
        100,
      );
    },
    100,
  );
  
</script>

