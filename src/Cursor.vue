<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useCustomCursor } from '@stores/customCursor';
  import {
    NavigationIcon,
  } from '@components/icon';
  import { useConfiguration } from '@stores/configuration';

  const customCursor = useCustomCursor();
  const shouldAnimate = ref(false);

  const config = useConfiguration();

  onMounted(() => {

    const cursorEl = document.getElementById('cursor') as HTMLDivElement;
    customCursor.init(cursorEl);

    // wait for the config to be read from storage
    setTimeout(() => {
      customCursor._updateScale(config.getCursor.scale);
      customCursor._updateDisplay(config.getCursor.type);
    }, 100);

    document.addEventListener('mousemove', (e: MouseEvent) => {
      const cursorEl = document.getElementById('cursor') as HTMLDivElement;
      const curX = e.clientX - cursorEl.offsetWidth / 2;
      const curY = e.clientY - cursorEl.offsetHeight / 2;

      cursorEl.style.left = `${curX}px`
      cursorEl.style.top = `${curY}px`
    });

    document.addEventListener('click', (_e: MouseEvent) => {
      shouldAnimate.value = true;
      setTimeout(() => {
        shouldAnimate.value = false;
      }, 500);
    });
    document.addEventListener('inner-click', (_e: any) => {
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
    <NavigationIcon role="presentation"/>
  </div>
</template>
<style>

  *{
    @apply !cursor-none;
  }
  
  div#cursor {
    scale: var(--cursor-scale, 1);
    --color-default-outer: var(--color-red-500);
    --color-default-inner: var(--color-orange-500);
    --color-pointer-outer: var(--color-blue-500);
    --color-pointer-inner: var(--color-green-500);
  }
  
  div#cursor[cursor-display="monochrome"] {
    scale: var(--cursor-scale, 1);
    --color-default-outer: var(--color-white);
    --color-default-inner: var(--color-slate-500);
    --color-pointer-outer: var(--color-slate-200);
    --color-pointer-inner: var(--color-slate-800);
  }

  div#cursor svg[data-icon="navigation"]{
    @apply transition-colors duration-500;
    &> polygon[data-layer="inner"] {
      @apply transition-colors;
    }
  }
  div#cursor.default svg[data-icon="navigation"] {
    stroke: var(--color-default-outer);
    fill: var(--color-default-inner);
    &> polygon[data-layer="inner"] {
      stroke: var(--color-default-inner);
      fill: var(--color-default-inner);
    }
  }
  div#cursor.pointer > svg[data-icon="navigation"] {
    stroke: var(--color-pointer-outer);
    fill: var(--color-pointer-inner);
    & polygon[data-layer="inner"] {
      stroke: var(--color-pointer-inner);
      fill: var(--color-pointer-inner);
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
