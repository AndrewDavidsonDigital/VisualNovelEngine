<script setup>
import { onMounted, ref } from 'vue'

// reactive state
let startTime = ref(0)
let endTime = ref(0)
let custom = ref('ko-KR')

let days = ref([])

const rawDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'FAKEDAY',
  'Saturday',
  'Sunday',
]

const DAYNAME_CONSTS = Object.freeze({
  monday: new Date("2020-06-01"),
  tuesday: new Date("2020-06-02"),
  wednesday: new Date("2020-06-03"),
  thursday: new Date("2020-06-04"),
  friday: new Date("2020-06-05"),
  saturday: new Date("2020-06-06"),
  sunday: new Date("2020-06-07"),
})



function translateEntireWeekCustom(){
  translateEntireWeek(custom.value)
}

function justIterateLoop(){
  startTime.value = Date.now()
  days.value = []
  
  rawDays.forEach((dayName) => {
    // const localedDay = resolveLocaleDay(dayName, locale)
    days.value.push(dayName)
  });
  
  endTime.value = Date.now()
}

function translateEntireWeek(locale){
  startTime.value = Date.now()
  days.value = []
  
  rawDays.forEach((dayName) => {
    const localedDay = resolveLocaleDay(dayName, locale)
    days.value.push(localedDay)
  });
  
  endTime.value = Date.now()
}
  
function resolveLocaleDay(dayName, locale){
  switch(dayName){
    case 'Monday':
      return DAYNAME_CONSTS.monday.toLocaleString(locale, { 'weekday': 'short' });
    case 'Tuesday':
      return DAYNAME_CONSTS.tuesday.toLocaleString(locale, { 'weekday': 'short' });
    case 'Wednesday':
      return DAYNAME_CONSTS.wednesday.toLocaleString(locale, { 'weekday': 'short' });
    case 'Thursday':
      return DAYNAME_CONSTS.thursday.toLocaleString(locale, { 'weekday': 'short' });
    case 'Friday':
      return DAYNAME_CONSTS.friday.toLocaleString(locale, { 'weekday': 'short' });
    case 'Saturday':
      return DAYNAME_CONSTS.saturday.toLocaleString(locale, { 'weekday': 'short' });
    case 'Sunday':
      return DAYNAME_CONSTS.sunday.toLocaleString(locale, { 'weekday': 'short' });
    default:
      return 'N/A'
  }
}
onMounted(() => {
  justIterateLoop();
});
</script>

<template>
  <section class="tw-text-white tw-text-left tw-w-1/2 tw-pb-5">
    <h2 class="tw-text-xl">Issue: </h2>
    <p class="tw-indent-5">Verification / Dissproval of claim: <em>Native JS Date object intl is <strong>SLOW</strong></em></p>
    <h2 class="tw-text-xl">Details: </h2>
    <p class="tw-indent-5">Mate refused to use the inate embedded translations from JS Date object, for unclear reasons and claimed its was just obsurdly slow when asked for reasoning</p>
    <h2 class="tw-text-xl">Logic: </h2>
    <p class="tw-indent-5">Code takes a list of String represenations of `Day of the week`, i.e.: Monday, and needs to resolve the intl, short name for these, relative to a given locale.<pre  class="tw-indent-0 tw-p-3 tw-rounded-md tw-bg-orange-300 tw-text-black tw-italic"><code lang="js">DAYNAME_CONSTS.friday.toLocaleString(locale, { 'weekday': 'short' })</code></pre> From this we can see that resolving results for 8 entities takes between 0 and 1ms, this is clearly not slow. As Just iterating over the loop can be seen to take between 0 and 1ms, but on average closer to 0</p>
  </section>
  <section class="tw-flex tw-gap-x-2 tw-text-black tw-pb-5">
    <button
      class="tw-px-2 tw-bg-slate-400 tw-rounded-md" 
      @click="justIterateLoop">Loop only</button>
    <button 
      class="tw-px-2 tw-bg-slate-400 tw-rounded-md" 
      @click="translateEntireWeek('en-AU')">Start-AU</button>
    <button 
      class="tw-px-2 tw-bg-slate-400 tw-rounded-md" 
      @click="translateEntireWeek('JA')">Start-JA</button>
    <button 
      class="tw-px-2 tw-bg-slate-400 tw-rounded-md" 
      @click="translateEntireWeekCustom">Start-custom</button> 
    <div style="background: pink; width: 100px"><input v-model="custom" type='text' style="width: 100%"></div>
  </section>
  <section class="tw-w-1/2 tw-flex tw-flex-col">
    <div class="tw-w-64 tw-inline-flex tw-justify-between"><span>Start Timestamp:</span><span>{{startTime}}</span></div>
    <div class="tw-w-64 tw-inline-flex tw-justify-between"><span>End Timestamp:</span><span>{{endTime}}</span></div>
    <div class="tw-w-64 tw-inline-flex tw-justify-between"><span>Delta:</span><span>{{endTime - startTime}}</span></div>
    <hr>
    <div>
      <article v-for="(dayShort, index) in days" :key="index">
        <h3>{{dayShort}}</h3>
      </article>
    </div>
  </section>
</template>