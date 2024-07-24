
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useCustomCursor } from '@stores/customCursor';
  import {
    NavigationIcon,
  } from '@components/icon';

  const customCursor = useCustomCursor();
  const shouldAnimate = ref(false);

  onMounted(() => {

    const cursorEl = document.getElementById('cursor') as HTMLDivElement;
    customCursor.init(cursorEl);

    document.addEventListener('mousemove', (e: MouseEvent) => {
      const cursorEl = document.getElementById('cursor') as HTMLDivElement;
      const curX = e.clientX - cursorEl.offsetWidth / 2;
      const curY = e.clientY - cursorEl.offsetHeight / 2;

      cursorEl.style.left = `${curX}px`
      cursorEl.style.top = `${curY}px`
    });

    document.addEventListener('click', (e: MouseEvent) => {
      shouldAnimate.value = true;
      setTimeout(() => {
        shouldAnimate.value = false;
      }, 500);
    });
    document.addEventListener('inner-click', (e: any) => {
      shouldAnimate.value = true;
      setTimeout(() => {
        shouldAnimate.value = false;
      }, 500);
    });
  });

</script>

<template>
  <div id="cursor" class="z-max fixed rounded-full pointer-events-none default w-1 h-1">
    <section 
      :class="[
        'absolute -top-2 -left-2 w-4 h-4 border border-solid border-red rounded-full z-[-1] opacity-0',
        { 'animate-ripple ring-1': shouldAnimate },
      ]"
    ></section>
    <NavigationIcon />
  </div>
</template>
<style>

  *{
    @apply !cursor-none;
  }


  div#cursor svg[data-icon="navigation"]{
    @apply transition-colors duration-500;
    &> polygon[data-layer="inner"] {
      @apply transition-colors;
    }
  }
  div#cursor.default svg[data-icon="navigation"] {
    @apply stroke-red-500;
    @apply fill-red-500;
    &> polygon[data-layer="inner"] {
      @apply stroke-orange-500;
      @apply fill-orange-500;
    }
  }
  div#cursor.pointer > svg[data-icon="navigation"] {
    @apply stroke-blue-500;
    @apply fill-blue-500;
    & polygon[data-layer="inner"] {
      @apply stroke-green-500;
      @apply fill-green-500;
    }
  }

  div#cursor.pointer > svg[data-icon="navigation"] {
    @apply origin-bottom-right;
    animation: rotate 0.75s linear infinite alternate;
  }

  @keyframes rotate {
    to {
      transform: rotate(10deg);
    }
    from {
      transform: rotate(-10deg);
    }
  }
</style>
