<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

  export type EffectType = 'off' | 'warning' | 'good-bad' | 'old-school' | 'monochrome' | 'glitch' | 'versus';

  export type EffectExtraDataType = VersusData;
  type VersusData = IVersusData;

  interface IVersusData {
    _discriminator: 'IVersusData';
    left: string;
    right: string;
    ratio?: string;
  }

  interface Props {
    effect: EffectType;
    toggledOn?: {
      type: Boolean;
      default: false;
    },
    visible: boolean,
    dataAttributes?: string[];
    extraData?: EffectExtraDataType;
  }
  const props = defineProps<Props>()

  const layerRef = ref<HTMLDivElement>()

  function resetDataAttributes(){
    if (props.dataAttributes && props.dataAttributes?.length > 0){
      props.dataAttributes.forEach(attr => {
        layerRef.value?.setAttribute(`data-${attr}`, '');
      });
    }
  }

  watch(() => props.dataAttributes, () => {
    resetDataAttributes();
  })

  onMounted(() => {
    resetDataAttributes();
  })

</script>

<template>
  <div 
    v-show="props.visible"
    class="z-10 *:size-full"
    ref="layerRef"
  >
    <Transition>
      <section 
        v-if="props.effect === 'off'"
      ></section>
      <section 
        v-else-if="props.effect === 'warning'"
        class="animate-effectWarning"
      ></section>
      <section 
        v-else-if="props.effect === 'good-bad'"
        class='flex'
      >
        <section 
          :class="[
            'effects-grid w-1/2 relative opacity-0',
            { 'leftAnimated': props.effect === 'good-bad'},
          ]"
          style="--shadowColour:white"
        >
          <div class="h-0 w-full effect-shadow"></div>
          <div class="h-full w-0 effect-shadow"></div>
          <div class="h-0 w-full effect-shadow absolute -bottom-0"></div>
        </section>
        <section
          :class="[
            'effects-grid w-1/2 relative opacity-0',
            { 'rightAnimated': props.effect === 'good-bad'},
          ]"
          style="--shadowColour:black"
        >
          <div class="h-0 w-full effect-shadow"></div>
          <div class="h-full w-0 effect-shadow absolute -right-0"></div>
          <div class="h-0 w-full effect-shadow absolute -bottom-0"></div>
        </section>
      </section>
      <section 
        v-else-if="props.effect === 'old-school'"
        class="oldSchool"
      ></section>
      <section 
        v-else-if="props.effect === 'monochrome'"
        class="monochrome"
      ></section>
      <section 
        v-else-if="props.effect === 'glitch'"
        class="overflow-hidden relative opacity-75"
      >
        <div class="glitch glitch_pink bg-rose-500 left-1 -top-1"></div>
        <div class="glitch glitch_green bg-emerald-400 -left-1 top-1"></div>
        <div class="glitch glitch_black bg-black left-0"></div>
      </section>
      <section 
        v-else-if="props.effect === 'versus' && props.extraData?._discriminator === 'IVersusData'"
        class="effects-grid effect-versus"
        :class="props.extraData.ratio"
      >
        <div class="size-full under"><img :src="props.extraData.left"></div>
        <div class="size-full over"><img :src="props.extraData.right"></div>
        <div class="borderEdge"></div>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
  .v-enter-active,
  .v-leave-active {
    transition: all 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  .effect-versus {
    @apply relative;

    --shadowColour: rgb(187, 54, 207);

    --versusClipPath_30: polygon(0% 0%, 20% 0%, 40% 100%, 100% 100%, 100% 0%);
    --versusClipPath_40: polygon(0% 0%, 30% 0%, 50% 100%, 100% 100%, 100% 0%);
    --versusClipPath_50: polygon(0% 0%, 40% 0%, 60% 100%, 100% 100%, 100% 0%); /* DEFAULT 50-50 */
    --versusClipPath_60: polygon(0% 0%, 50% 0%, 70% 100%, 100% 100%, 100% 0%);
    --versusClipPath_70: polygon(0% 0%, 60% 0%, 80% 100%, 100% 100%, 100% 0%);

    --versusEdgePath_30: 30%;
    --versusEdgePath_40: 40%;
    --versusEdgePath_50: 50%;
    --versusEdgePath_60: 60%;
    --versusEdgePath_70: 70%;

    --versusClipPath: var(--versusClipPath_50);
    --versusEdgePath: var(--versusEdgePath_50);
    --brightnessLeft:  0.5;
    --brightnessRight: 0.5;

    &.ratio-30 {
      --versusClipPath: var(--versusClipPath_30);
      --versusEdgePath: var(--versusEdgePath_30);
      --brightnessLeft:  0.5;
      --brightnessRight: 0.9;
    }
    &.ratio-40 {
      --versusClipPath: var(--versusClipPath_40);
      --versusEdgePath: var(--versusEdgePath_40);
      --brightnessLeft:  0.6;
      --brightnessRight: 0.8;
    }
    &.ratio-50 {
      --versusClipPath: var(--versusClipPath_50);
      --versusEdgePath: var(--versusEdgePath_50);
      --brightnessLeft:  0.7;
      --brightnessRight: 0.7;
    }
    &.ratio-60 {
      --versusClipPath: var(--versusClipPath_60);
      --versusEdgePath: var(--versusEdgePath_60);
      --brightnessLeft:  0.8;
      --brightnessRight: 0.6;
    }
    &.ratio-70 {
      --versusClipPath: var(--versusClipPath_70);
      --versusEdgePath: var(--versusEdgePath_70);
      --brightnessLeft:  0.9;
      --brightnessRight: 0.5;
    }


    .over {
      clip-path: var(--versusClipPath);
      filter: brightness(var(--brightnessRight));
      @apply transition-all duration-300;
    }

    .borderEdge {
      @apply absolute;
      @apply transition-all duration-300;
      @apply w-0 h-full;
      box-shadow: 0 0 30px 25px var(--shadowColour);
      left: calc(var(--versusEdgePath) - 2px);
      rotate: -19.55deg; /* no clue why this is this actual rotational value */
      scale: 1.1;
    }

    .under {
      filter: brightness(var(--brightnessLeft));
      @apply transition-all duration-300;
    }
  }

  .effects-grid {
    @apply grid [grid-template-areas:_"effects"] *:[grid-area:_effects];
  }

  .effect-shadow {
    box-shadow: 0 0 30px 30px var(--shadowColour);
  }

  [data-animateLeft] > section > section.leftAnimated {
    @apply animate-effectGoodBad;
  }

  [data-animateRight] > section > section.rightAnimated {
    @apply animate-effectGoodBad;
  }

  div:has(>.oldSchool) {
    @apply bg-yellow-50;
    @apply mix-blend-color;
  }

  div:has(>.monochrome) {
    @apply bg-black;
    @apply mix-blend-color;
  }

  .glitch_black{
    animation-duration: 0.3s;
    animation-name: imgGlitch;
  }

  .glitch_pink{
    animation-delay: 0.1s;
    animation-duration: 0.2s;
    animation-name: imgGlitch, opacityGlitch;
  }

  .glitch_green{
    animation-direction: alternate-reverse;
    animation-duration: 0.3s;
    animation-name: imgGlitch, opacityGlitch;
  }

  .glitch{
    @apply size-[102%] absolute -ml-[1%];
    @apply ease-linear;
    animation-iteration-count: infinite;

    --glitchClipPath1: polygon(
      -2% 0%, 7% 0%, 7% 3%, -2% 3%, 
      -2% 19%, 12% 19%, 12% 23%, 15% 23%, 15% 26%, 9% 26%, 9% 22%, -2% 22%, 
      -2% 34%, 2% 34%, 2% 42%, -2% 42%, 
      -2% 52%, 3% 52%, 3% 58%, 2% 58%, 2% 66%, -2% 66%, 
      -2% 83%, 11% 83%, 11% 77%, 13% 77%, 13% 89%, -2% 89%, 
      -2% 96%, 5% 96%, 5% 100%, -2% 100%,

      14% 100%, 
      14% 55%, 17% 55%, 17% 70%, 20% 70%, 20% 45%, 17% 45%, 17% 51%, 14% 51%, 14% 100%,  /* left-inner */
      67% 100%, 
      67% 51%, 73% 51%, 73% 42%, 67% 42%, 67% 51%, 56% 51%, 56% 58%, 67% 58%, 67% 100%,  /* right-inner */ 

      23% 100%, 23% 94%, 41% 94%, 41% 96%, 55% 96%, 55% 100%, 
      73% 100%, 73% 94%, 78% 94%, 78% 84%, 80% 84%, 80% 100%,
      86% 100%, 86% 96%, 96% 96%, 96% 94%, 90% 94%, 90% 100%, 
      
      100% 100%, /* bottom right corner */

      100% 84%, 95% 84%, 95% 72%, 96% 72%, 96% 80%, 100% 80%, 
      100% 66%, 90% 66%, 90% 61%, 100% 61%, 
      100% 56%, 96% 56%, 96% 50%, 98% 50%, 98% 36%, 100% 36%, 
      100% 23%, 93% 23%, 93% 20%, 98% 20%, 98% 14%, 100% 14%, 
      100% 6%, 95% 6%, 95% 10%, 93% 10%, 93% 0%, 100% 0%, 
      
       /* run along edge back to start */
      100% 100%, 
      -2% 100%
      );
      --glitchClipPath2: polygon(
      -2% 0%, 10% 0%, 10% 2%, -2% 2%, 
      -2% 19%, 11% 19%, 11% 26%,  9% 26%, 9% 22%, -2% 22%, 
      -2% 35%, 2% 35%, 2% 41%, -2% 41%, 
      -2% 52%, 2% 52%, 2% 58%, 2% 58%, 2% 66%, -2% 66%, 
      -2% 83%, 11% 83%, 11% 77%, 12% 77%, 12% 85%, -2% 85%, 
      -2% 95%, 5% 95%, 5% 100%, -2% 100%,

      14% 100%, 
      14% 55%, 16% 55%, 16% 70%, 20% 70%, 20% 45%, 19% 45%, 19% 51%, 14% 51%, 14% 100%,  /* left-inner */
      67% 100%, 
      67% 51%, 73% 51%, 73% 51%, 67% 51%, 67% 50%, 56% 50%, 56% 55%, 67% 55%, 67% 100%,  /* right-inner */ 

      23% 100%, 23% 96%, 41% 96%, 41% 96%, 55% 96%, 55% 100%, 
      70% 100%, 70% 94%, 78% 94%, 78% 87%, 80% 87%, 80% 100%,
      86% 100%, 86% 96%, 94% 96%, 94% 94%, 90% 94%, 90% 100%, 
      
      100% 100%, /* bottom right corner */

      100% 84%, 95% 84%, 95% 72%, 96% 72%, 96% 79%, 100% 79%, 
      100% 67%, 90% 67%, 90% 60%, 100% 60%, 
      100% 55%, 94% 55%, 94% 51%, 98% 51%, 98% 40%, 100% 40%, 
      100% 23%, 92% 23%, 92% 20%, 98% 20%, 98% 15%, 100% 15%, 
      100% 7%, 95% 7%, 95% 10%, 91% 10%, 91% 0%, 100% 0%, 
      
       /* run along edge back to start */
      100% 100%, 
      -2% 100%
      );
      --glitchClipPath3:  polygon(
      -2% 0%, 7% 0%, 7% 3%, -2% 3%, 
      -2% 19%, 12% 19%, 12% 23%, 15% 23%, -2% 23%,
      -2% 34%, 2% 34%, 2% 42%, -2% 42%,  /*--------------------------*/
      -2% 52%, 2% 52%, 2% 58%, 3% 58%, 3% 66%, -2% 66%, 
      -2% 83%, 11% 83%, 11% 77%, 11% 77%, 11% 87%, -2% 87%, 
      -2% 95%, 7% 95%, 7% 100%, -2% 100%,

      15% 100%, 
      15% 55%, 17% 55%, 17% 65%, 19% 65%, 19% 55%, 17% 55%, 17% 50%, 15% 50%, 15% 100%,  /* left-inner */
      67% 100%, 
      67% 51%, 73% 51%, 73% 42%, 67% 42%, 67% 51%, 56% 51%, 56% 58%, 67% 58%, 67% 100%,  /* right-inner */ 

      23% 100%, 23% 96%, 41% 96%, 41% 94%, 55% 94%, 55% 100%, 
      72% 100%, 72% 94%, 78% 94%, 78% 90%, 79% 90%, 79% 100%,
      87% 100%, 87% 96%, 96% 96%, 96% 94%, 89% 94%, 89% 100%, 
      
      100% 100%, /* bottom right corner */

      100% 83%, 94% 83%, 94% 75%, 95% 75%, 95% 80%, 100% 80%, 
      100% 66%, 87% 66%, 87% 61%, 100% 61%, 
      100% 56%, 96% 56%, 96% 49%, 98% 49%, 98% 36%, 100% 36%, 
      100% 23%, 93% 23%, 93% 21%, 98% 21%, 98% 14%, 100% 14%, 
      100% 6%, 97% 6%, 97% 5%, 93% 5%, 93% 0%, 100% 0%, 
      
       /* run along edge back to start */
      100% 100%, 
      -2% 100%
      );    
  }
  
  @keyframes opacityGlitch {
    0%, 100%{
      opacity: 35%;
    }
    10%{
      opacity: 75%;
    }
    30%{
      opacity: 65%;
    }
    50%{
      opacity: 90%;
    }
    85%{
      opacity: 75%;
    }
  }

  /* As we are using polygons, which are transitionable rather than svg-path we need to only have a transition delta as small as possible, in this case 1%*/
  @keyframes imgGlitch {
  0%,100%{
    clip-path: var(--glitchClipPath1);
    /* clip-path: path("M400,21.66V10.49h-116.29V0H39.36V54.56H0v36.09H101.25v9.77H.23v5.52H101.25v14.44H22.77v15.29H13.82v39.06H.23v6.79H13.82v15.29h60.63v20.81H10.25v51.17H.23v26.75H61.69v30.57h-29.35v12.1H0v30.57H22.77v31.36H400v-25.41h-31.43v-5.95h31.43v-8.28h-31.43v-15.92h-9.57v-14.65h32.56v-13.38h8.44v-10.83h-8.44v-52.23h-79.37v-21.02h69.78v-7.64h18.03v-24.7h-8.44v-52.58h-22.99v-11.89h31.43v-15.29h-31.43v-36.3h31.43V35.03h-116.29v-13.38h116.29ZM138.57,120.38h15.14v15.29h-15.14v-15.29ZM74.45,386.85v-18.08h39.56v14.01h144.19v4.06H74.45Zm89.32-42.28v-6.37h-34.45v-12.1h48.49v18.47h-14.04Zm56.73-25.48h-5.05v-2.55h5.05v2.55Zm-5.05-13.38v-10.19h5.05v10.19h-5.05Z"); */
  }
  1%, 33%{
    clip-path: var(--glitchClipPath2);
    /* clip-path: path("M398.2,238.77v-14.06h2.28v-24.74h-2.28v-37.76h-8.45v-4.24H215.93v-3.23h178.76v-61.25H254.7v-3.19h33.11v-11.59h102.55V29.58h-52.25V0H93.75V13.18H0v11.19H39.84v29.77H.48v36.15H39.84v28.22H18.22v6.81h5.04v10.06H14.3v61.25h60.63v2.12H1.05v56.57H29.76v21.71H96.62v3.81h4.79v7.66h-3.83v-6.14H.6v14.67H62.17v13.8H.48v30.62H82.37v3.83h35.94v8.77H15.17v13.3H118.31v8.77H.48v23.84H244.84v-12.97h134.3v-18.11h21.34v-8.29h-21.34v-26.19h19.02v-25.45h-42.19v-26.19h18.5v-1.93h26.01v-10.85h-26.01v-25.51h-71.49v-5.73h95.22Zm-171.06-75.27v14.95h-11.21v-14.95h11.21Zm-88.09-38.17h38.45v-5.25h15.55v15.31h-54.01v-10.06Zm76.88,189.34v-3.83h40.42v14.92h-10.22v-11.09h-30.21Zm-45.94,30.62h7.52v8.77h-7.52v-8.77Zm0,22.07h7.52v8.77h-7.52v-8.77Z"); */
  }
  34%, 66% {
    clip-path: var(--glitchClipPath3);
    /* clip-path: path("M400.21,112.61v-15.31H234.82v-9.04h52.51v-6.59h112.67V32.54h-33.6V6.06h-95.3V0H69.47V2.36H29.34V13.55h40.13v7.51H32.34v20.87h-12.38v10.18H0v36.15H19.96v49.37h18.2v23.05H13.82v11.8H.23v6.81H13.82v37.96h18.52v22.74H13.14v13.3h19.2v8.96h106.23v4.44H.23v26.8H61.69v30.62h-29.35v14.67H114.47v11.23H17.55v30.62h18.3v17.63h51.68v-17.63h26.94v11.98h143.72v5.65h141.81v-25.45h-114.47v-5.21h101.25v-.75h13.22v-8.29h-13.22v-29.24h-17.58v-10.32h30.72v-10.85h-30.72v-5.11h30.72v-31.26h-16.99v-29.1h17.08v-24.74h-60.14v-6.74h-24.11v-8.11h70.6v-61.25h-20.92v-29.24h34.78Zm-164.97,180.87v-8.94h88.66v12.37h-108.46v-3.43h19.79Zm-50.53-151.63v18.82h-30.76v-23.05h71.6v4.23h-40.84Z"); */
  }
}
</style>