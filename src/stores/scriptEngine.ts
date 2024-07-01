import { defineStore } from 'pinia'
import { IBGM, IBackdrop, IChar, IGameScript, IHistoryEntry, IInitialText, INewScene, IScriptEngine, IText, ITransition } from './interfaces';

const DEFAULT_STATE = Object.freeze({
  chapterDetails: {
    chapterIndex: -1,
    path: '',
    title: '',
    displayTitle: false,
    scenePaths: [],
    history: [],
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


/**
 * @description: Scripting interpreter engine,
 * 
 * @function: prefixed with `$` are to be considered private and should never be used directly
 * @function: prefixed with `_` are to be considered as mutation-triggering-actions
 */
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
      trace('progress');
      // ensure we can progress
      if (this.currentScene.transitionIndex >= this.currentScene.transitions.length || this.currentScene.transitionIndex === -1){
        this.$loadScene();
      } else {
        const nextTransition: ITransition = this.currentScene.transitions[this.currentScene.transitionIndex]
        this.currentScene.transitionIndex++;
        this._updateTransition(nextTransition)
      }
      // transition
      trace('progress_end');

    },
    postProgressChapter(){
      this.currentScene.sceneIndex = 0;
      this.currentScene.chapterIndex = this.chapterDetails.chapterIndex;
    },
    $getScene(){
      trace('$getScene');
      const sceneText: IText = {...this.currentScene.text};
      return sceneText;
    },
    $loadScene(){
      trace('$loadScene');
      let nextSceneIndex = this.currentScene.sceneIndex + 1;
      if (this.chapterDetails.chapterIndex === -1){
        this.$loadChapter();
      }else if (this.chapterDetails.chapterIndex !== this.currentScene.chapterIndex 
        || this.currentScene.sceneIndex === -1
        || this.currentScene.sceneIndex >= this.chapterDetails.scenePaths.length
      ){
        this.postProgressChapter();
        this.$loadChapter();
        nextSceneIndex = 0;
      }
      
      trace(`nextSceneIndex (${nextSceneIndex})`);
      const nextScenePath = `${this.chapterDetails.scenePaths[0]}.json`
      trace(`nextScenePath (${nextScenePath})`);

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
      trace('$loadChapter');
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
      this.currentScene.activeBmg = newBgm;
    }, 
    _updateBackdrop(newBackdrop: IBackdrop){
      this.currentScene.backdrop = newBackdrop;
    },
    _updateChars(newChars: IChar[]){
      this.currentScene.activeChars = newChars
    },
    _updateText(newText: IInitialText){
      this.currentScene.text = newText
      this.$writeHistory();
    },
    _updateTransitions(newTransitions: ITransition[]){
      this.currentScene.transitions = newTransitions
    },
    _updateTransition(newTransition: ITransition){
      this.currentScene.text = {...(newTransition.text)}
      this.currentScene.activeChars = {...(newTransition.chars)}
      // add stuff relating to delay limiting
      // this.currentScene
      this.$writeHistory();
    },
    $writeHistory(){
      const currentEntry: IHistoryEntry = {
        actorName: this.currentScene.text.speaker,
        text: this.currentScene.text.text,
        audioPath: this.currentScene.text.voice || '',
      }
      if (!(this.chapterDetails.history)){
        this.chapterDetails.history = [];
      }
      this.chapterDetails.history.push(currentEntry);
    }
  },
})


function trace(message: string){
  console.log(`Scripting Engine:\t${message}`)
}