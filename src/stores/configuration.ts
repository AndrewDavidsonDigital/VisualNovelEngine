import { useConfig } from '@lib/storage';
import { defineStore } from 'pinia'
import { DisplayType } from './customCursor';

export const labelMap_EN = new Map<string, string>();
labelMap_EN.set('master', 'Master');
labelMap_EN.set('audio', 'Audio');
labelMap_EN.set('bgm'  , 'Music');
labelMap_EN.set('sfx'  , 'Effects');
labelMap_EN.set('voice', 'Voices');
labelMap_EN.set('text', 'Text');
labelMap_EN.set('displayRatio', 'Text Display Speed');
labelMap_EN.set('autoWaitRatio', 'Auto Wait Duration');
labelMap_EN.set('cursor', 'Cursor');

const CONFIG_KEYS = Object.freeze([
  'audio',
  'text',
  'cursor',
]);

export interface IConfiguration {
  audio: IAudioConfiguration;
  text: ITextConfiguration;
  cursor: ICursorConfiguration;
  bar: string;
  baz: string;
}
export interface ITextConfiguration {
  displayRatio: number,
  autoWaitRatio: number,
}
export interface ICursorConfiguration {
  type: DisplayType,
  scale: number,
}
export interface IAudioConfiguration {
  master: number,
  bgm: number,
  sfx: number,
  voice: number,
}
const DEFAULT_STATE: IConfiguration = Object.freeze({
  audio: {
    master: 1,
    bgm: 0.7,
    sfx: 0.7,
    voice: 0.7,
  },
  text: {
    displayRatio: 1,
    autoWaitRatio: 1,
  }, 
  cursor: {
    type: "default" as DisplayType,
    scale: 1,
  },
  bar: '',
  baz: '',
});

function pluckKeys(collection: {[x:string]: any}, keys: string[] | readonly string[]){
  const retval: {[x:string]: any} = {};

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(collection, key)){
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

  getters: {
    getCursor(): ICursorConfiguration {
      return this.cursor;
    },
  },

  actions: {
    init() {
      const existingSettings = useConfig().get() || null;
      if (existingSettings){
        const settings = JSON.parse(existingSettings);
        // find a better way to merge this in
        CONFIG_KEYS.forEach((key) => {
          // console.log('setting key: ', key, ' with value: ', settings[key]);
          this[key as keyof IConfiguration] = settings[key];
        });
      }
    },
    save() {
      const localInstance = pluckKeys({...this}, CONFIG_KEYS);      
      useConfig().set(JSON.stringify(localInstance));
    },
    _updateCursor(_value: ICursorConfiguration){
      this.cursor = _value;
    },
    update(_accessPath: string, _value: any){

      // this['audio']
      // this.audio
    },
    getConfigurables(){
      return pluckKeys({...this}, CONFIG_KEYS);
    },
  },
})
