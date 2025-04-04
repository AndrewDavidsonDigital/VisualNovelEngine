import { defineStore } from 'pinia'

export interface ICustomCursor {
  cursor: CursorType;
  htmlElement: HTMLDivElement | null;
  scale: number;
  display: DisplayType;
}
export type CursorType = 'default' | 'pointer';
export type DisplayType = 'default' | 'monochrome';

const DEFAULT_STATE: ICustomCursor = Object.freeze({
  cursor: 'default',
  htmlElement: null,
  scale: 1,
  display: 'default',
})

export const useCustomCursor = defineStore('cursor', {
  state: () => {
    return {...DEFAULT_STATE}
  },

  actions: {
    init(el: HTMLDivElement) {
      this.cursor = 'default';
      this.htmlElement = el;
      this.scale = 1;
      this.display = 'default';
      this.htmlElement?.setAttribute('cursor-display', this.display);
      this.htmlElement?.style.setProperty('--cursor-scale', `${this.scale}`);
    },
    clear(){
      this._updateType('default');
    },
    reset(){
      this.cursor = 'default';
      this.scale = 1;
      this.display = 'default';
      this.htmlElement?.setAttribute('cursor-display', this.display);
      this.htmlElement?.style.setProperty('--cursor-scale', `${this.scale}`);
    },
    _updateType(newType: CursorType){
      const oldClass = this.cursor;
      const newClass = newType;

      this.cursor = newType;

      this.htmlElement?.classList.replace(oldClass, newClass);
    },
    _updateScale(newScale: number){
      this.scale = newScale;
      this.htmlElement?.style.setProperty('--cursor-scale', `${newScale}`);
    },
    _updateDisplay(newDisplay: DisplayType){
      this.display = newDisplay;
      this.htmlElement?.setAttribute('cursor-display', newDisplay);
    },
  },
})
