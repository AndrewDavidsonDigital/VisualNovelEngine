import { defineStore } from 'pinia'
import { IBGM, IBackdrop, IChar, IGameScript, IInitialText, INewScene, IScriptEngine, IText, ITransition } from './interfaces';

const DEFAULT_STATE = Object.freeze({
  chapterDetails: {
    chapterIndex: -1,
    path: '',
    title: '',
    displayTitle: false,
    scenePaths: [],
  },
  currentScene : {
    activeBmg: {
      path: '',
    },
    activeChars: [],
    chapterIndex: -1,
    sceneIndex: -1,
    transitionIndex: -1,
    transitions: [],
    backdrop : {
      path: '',
      type: 'image',
    },
    text: {
      speaker: '',
      text: '',
      position: 'center',
      voice: '',
    }
  },
  gameScript: undefined,
});

const CONFIG_KEYS = Object.freeze([
  'chapterDetails',
  'currentScene',
]);

export const useScriptEngine = defineStore('scriptEngine', {
  state: () => {
    return { ...DEFAULT_STATE } as IScriptEngine
  },

  actions: {
    reset() {
      CONFIG_KEYS.forEach((key) => {
        this[key as keyof IScriptEngine] = (DEFAULT_STATE as any)[key];
      });
    },
    init(script: IGameScript) {
      this.reset();
      this.gameScript = script;
    },
    progress(){
      // ensure we can progress
      if (this.currentScene.transitionIndex >= this.currentScene.transitions.length){
        this.$loadScene();
      }
      // transition
      
    },
    postProgressChapter(){
      this.currentScene.sceneIndex = 0;
      this.currentScene.chapterIndex = this.chapterDetails.chapterIndex;
    },
    $loadScene(){
      let nextSceneIndex = this.currentScene.sceneIndex + 1;
      if (this.chapterDetails.chapterIndex === -1){
        this.$loadChapter();
      }
      if (this.chapterDetails.chapterIndex !== this.currentScene.chapterIndex 
        || this.currentScene.sceneIndex === -1
      ){
        this.postProgressChapter();
        nextSceneIndex = 0;
      }
      const nextScenePath = `${this.chapterDetails.scenePaths[0]}.json`

      console.log(nextScenePath);
      fetch(nextScenePath)
        .then((resp) => {
          if (resp.ok) return resp.json();
        })
        .then((resJson) => {
          console.log(resJson);
          this.currentScene.sceneIndex = nextSceneIndex;
          const newSceneData = {...resJson} as INewScene
          // set BMG
          this._updateBgm(newSceneData.bmg);
          this._updateBackdrop(newSceneData.backdrop);
          this._updateChars(newSceneData.chars);
          this._updateText(newSceneData.initialText);
          this._updateTransitions(newSceneData.transitions);
          // set Backdrop
          // set Chars
          // set Text
          this.currentScene.transitionIndex = 0;
        })
        .catch(err => {
          console.error(err);
        });
    },
    $loadChapter(andLoadScene = false){
      let nextChapterIndex = this.chapterDetails.chapterIndex + 1
      if (this.chapterDetails.chapterIndex === -1){
        nextChapterIndex = 0;
      }
      
      const chapter = this.gameScript?.chapters[nextChapterIndex];
      if (!chapter) return null;

      this.chapterDetails.chapterIndex = nextChapterIndex;
      this.chapterDetails.displayTitle = chapter.displayTitle;
      this.chapterDetails.scenePaths = chapter.scenePaths;
      this.chapterDetails.title = chapter.title;

      if(andLoadScene){
        this.$loadScene();
      }
    },
    _updateBgm(newBgm: IBGM){
      
    },
    _updateBackdrop(newBackdrop: IBackdrop){
      
    },
    _updateChars(newChars: IChar[]){
      
    },
    _updateText(newText: IInitialText){
      
    },
    _updateTransitions(newTransitions: ITransition[]){
      
    },
  },
})
