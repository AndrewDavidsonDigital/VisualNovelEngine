import { defineStore } from 'pinia'

export interface ICustomCursor {
  cursor: CursorType;
  htmlElement: HTMLDivElement | null;
}
export type CursorType = 'default' | 'pointer';

const DEFAULT_STATE: ICustomCursor = Object.freeze({
  cursor: 'default',
  htmlElement: null,
})

export const useCustomCursor = defineStore('cursor', {
  state: () => {
    return {...DEFAULT_STATE}
  },

  actions: {
    init(el: HTMLDivElement) {
      this.cursor = 'default';
      this.htmlElement = el;
    },
    clear(){
      this.updateTo('default');
    },
    updateTo(newType: CursorType){
      const oldClass = this.cursor;
      const newClass = newType;

      this.cursor = newType;

      this.htmlElement?.classList.replace(oldClass, newClass);
    }
  },
})
