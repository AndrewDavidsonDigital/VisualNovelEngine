import { defineStore } from 'pinia'
import { IAudioEngine } from '.';

export const useSfxEngine = defineStore('sfxAudioEngine', {
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
    setAndPlay(track: string){
      trace(`SetAndPlay Called for track: ${track}`);
      if (!this.el) return;
      this.setTrack(track);
      this.play();
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
      trace(`FadeOut Called`);
      if (!this.el) return;

      if (this.el.volume > 0.1){
        setTimeout(() => {
          this.volumeDown();
          this.fadeOut();
          },
          50,
        )
      } else {
        this.el.pause();
      }
    },
    volumeDown() {
      if (!this.el) return;

      this.el.volume = Math.max((this.el.volume - 0.05), 0);
    }
  },
})


function trace(message: string){
  console.log(`${Date.now()}💥SFX Engine:\t${message}`)
}