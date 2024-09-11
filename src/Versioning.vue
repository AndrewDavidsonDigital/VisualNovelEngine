<script setup lang="ts">
  import version from '@assets/game.version.json' ;

  interface IVersion {
    version: string;
    compiled: string;
  }

  const versionNumber = (version as IVersion).version;
  const compiledDate = (version as IVersion).compiled;

</script>

<template>
  <div class="mt-auto z-10 opacity-50 px-2">Version: {{ versionNumber }} Compiled: {{ compiledDate }}</div>
</template>
