
<script setup lang="ts">
  import Navigation from './components/Navigation.vue';
  import { RouterView } from 'vue-router'
</script>

<template>
  <h1>Hello App!</h1>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <section class="tw-flex tw-flex-col tw-justify-between tw-items-center tw-h-full tw-w-full">
    <Navigation />
    <RouterView />
  </section>
</template>

<style scoped>
</style>
