import { defineStore } from 'pinia'
import { IAudioEngine } from '.';
import { trace } from '@lib/logging';

const LOGGING_PREFIX = '🍃 BGM Engine:\t';

export const useBgmEngine = defineStore('bgmAudioEngine', {
  state: () => {
    return { 
      domId: "-1",
      el: null,
      count: 0,
      status: 'off',
      volumeMultiplier: 1,
    } as IAudioEngine
  },

  actions: {
    init(domId: string) {
      const el = document.getElementById(domId);
      if (el && el.tagName === "AUDIO"){
        this.domId = domId;
        this.el = el as HTMLAudioElement;
      }
    },
    setVolume (value: number){
      if (!this.el) return; 

      this.volumeMultiplier = value;
      this.el.volume = this.volumeMultiplier;
    },
    play() {
      if (!this.el) return; 

      this.el.volume = this.volumeMultiplier;
      this.el.play();
    },
    pause() {
      if (!this.el) return;

      this.el.pause();
    },
    restart() {
      if (!this.el) return;

      this.el.currentTime = 0;
      this.el.play();
    },
    setTrack(trackPath: string, play = false) {
      if (!this.el) return;

      this.el.src = trackPath;
      if (play) {
        this.play();
      }
    },
    stop() {
      if (!this.el) return;

      this.fadeOut();
    },
    fadeOut(){
      logger(`FadeOut Called`);
      if (!this.el) return;

      if (this.el.volume > 0.1){
        setTimeout(() => {
          this._volumeDown();
          this.fadeOut();
          },
          50,
        )
      } else {
        this.el.pause();
      }
    },
    fadeUp(){
      logger(`FadeUp Called`);
      if (!this.el) return;

      if (this.el.volume < this.volumeMultiplier){
        setTimeout(() => {
          this._volumeUp();
          this.fadeUp();
          },
          50,
        )
      }
    },
    _volumeDown() {
      if (!this.el) return;

      this.el.volume = Math.max((this.el.volume - 0.05), 0);
    },
    _volumeUp() {
      if (!this.el) return;

      this.el.volume = Math.max((this.el.volume + 0.05), this.volumeMultiplier);
    }
  },
})


function logger(message: string){
  trace(`${LOGGING_PREFIX}${message}`);
}