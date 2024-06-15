import { defineStore } from 'pinia'

export const labelMap_EN = new Map<String, String>();
labelMap_EN.set('audio', 'Audio');
labelMap_EN.set('bgm'  , 'Music');
labelMap_EN.set('sfx'  , 'Effects');
labelMap_EN.set('voice', 'Voices');

const KEY = 'illusionEngine_config';
const CONFIG_KEYS = Object.freeze([
  'audio',
  'bar',
  'baz',
]);

export interface IConfiguration {
  audio: IAudioConfiguration,
  bar: String,
  baz: String,
};

export interface IAudioConfiguration {
  bgm: number,
  sfx: number,
  voice: number,
}
const DEFAULT_STATE: IConfiguration = Object.freeze({
  audio: {
    bgm: 0.7,
    sfx: 0.7,
    voice: 0.7,
  },
  bar: '',
  baz: '',
});

function pluckKeys(collection: {[x:string]: any}, keys: string[] | readonly string[]){
  const retval: {[x:string]: any} = {};

  keys.forEach((key) => {
    if (collection.hasOwnProperty(key)){
      if (typeof collection[key] === 'object'){
        retval[key] = {...collection[key]};
      } else if (Array.isArray(collection[key])) {
        retval[key] = [...collection[key]];
      } else {
        retval[key] = collection[key];
      }
    }
  });

  return retval;
}

export const useConfiguration = defineStore('configuration', {
  state: () => {
    return {...DEFAULT_STATE}
  },

  actions: {
    init() {
      const existingSettings = window.localStorage.getItem(KEY) || null;
      if (existingSettings){
        const settings = JSON.parse(existingSettings);
        // find a better way to merge this in
        CONFIG_KEYS.forEach((key) => {
          this[key as keyof IConfiguration] = settings[key];
        });
      }
    },
    save() {
      const localInstance = pluckKeys({...this}, CONFIG_KEYS);      
      window.localStorage.setItem(KEY, JSON.stringify(localInstance));
    },
    update(accessPath: string, value: any){

      // this['audio']
      // this.audio
    },
    getConfigurables(){
      return DEFAULT_STATE;
    },
  },
})
