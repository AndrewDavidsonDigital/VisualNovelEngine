
<script setup lang="ts">
  import { useScriptEngine } from '@stores/scriptEngine';
  import router from '../../router';

  const scriptEngine = useScriptEngine()


  // logical flow is to set clean indexes and set everything back to 0 to start reading from first index
  // once this is set we can navigate to the player and let it `continue` from where we have just forced it to be
  scriptEngine.reset();

  router.push('game');

</script>