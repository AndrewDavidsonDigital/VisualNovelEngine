
<script setup lang="ts">
  import router from '../../router';

  // logical flow is to set clean indexes and set everything back to 0 to start reading from first index
  // once this is set we can navigate to the player and let it `continue` from where we have just forced it to be

  console.log('resetting stuff to 0');

  router.push('game');

</script>