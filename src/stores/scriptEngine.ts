import { defineStore } from 'pinia'
import { IBGM, IBackdrop, IChar, IGameScript, IHistoryEntry, IInitialText, INewScene, IScriptEngine, IText, ITransition } from './interfaces';
import { trace } from '@lib/logging';
import { EffectType } from '@components/layers/Effectslay.vue';

const LOGGING_PREFIX = '📕 Scripting Engine:\t';

interface ISaveData {
  chapterIndex: number;
  sceneIndex: number;
  transitionIndex: number;
}

/**
 * @description: Scripting interpreter engine,
 * 
 * @function: prefixed with `$` are to be considered internal and should never be used directly
 * @function: prefixed with `_` are to be considered as mutation-triggering-actions
 */
export const useScriptEngine = defineStore('scriptEngine', {
  state: () => {
    const baseObject = {
      chapterDetails: {
        chapterIndex: -1,
        path: '',
        title: '',
        displayTitle: false,
        scenePaths: [],
        history: [],
      },
      currentScene : {
        description: '',
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
        effect: 'off',
        text: {
          speaker: '',
          text: '',
          position: 'center',
          voice: '',
        }
      },
    } as IScriptEngine;

    return baseObject;
  },
  getters: { 
    getSceneText(){
      logger('getSceneText');
      const sceneText: IText = {...this.currentScene.text};
      return sceneText;
    },
    getSceneBGM(){
      logger('getSceneBGM');
      const sceneBgm: IBGM = {...this.currentScene.activeBmg};
      return sceneBgm;
    },
    getSceneBackdrop(){
      logger('getSceneBackdrop');
      const sceneBackdrop: IBackdrop = {...this.currentScene.backdrop};
      return sceneBackdrop;
    },
    getSaveData(){
      logger('getSaveData');
      const saveData: ISaveData = {
        chapterIndex: this.chapterDetails.chapterIndex,
        sceneIndex: this.currentScene.sceneIndex,
        transitionIndex: this.currentScene.transitionIndex,
      };
      return saveData;
    },
    getSceneChars(){
      logger('getSceneChars');
      const chars: IChar[] = [...this.currentScene.activeChars];
      return chars;
    },
    getSkipDescription(){
      logger('getSkipDescription');
      const desc: string = this.currentScene.description;
      return desc;
    },
  },
  actions: {
    /**
     * Need to wrap internal reset to ensure we keep the static gamescript
     */
    reset(){
      const existingGameScript = this.gameScript;
      this.$reset();
      this.gameScript = existingGameScript;
    },
    init(script: IGameScript) {
      this.$reset();
      this.gameScript = script;
    },
    skipFowards(){
      logger('skipFowards');
      this.$loadScene();
    },
    progress(){
      logger('progress');
      // ensure we can progress
      if (this.currentScene.transitionIndex >= this.currentScene.transitions.length || this.currentScene.transitionIndex === -1){
        this.$loadScene();
      } else {
        const nextTransition: ITransition = this.currentScene.transitions[this.currentScene.transitionIndex]
        this.currentScene.transitionIndex++;
        this._updateTransition(nextTransition)
      }
      // transition
      logger('progress_end');
    },
    postProgressChapter(){
      this.currentScene.sceneIndex = 0;
      this.currentScene.chapterIndex = this.chapterDetails.chapterIndex;
    },
    $loadScene(){
      logger('$loadScene');
      let nextSceneIndex = this.currentScene.sceneIndex + 1;
      if (this.chapterDetails.chapterIndex === -1){
        this.$loadChapter();
      } else if (this.chapterDetails.chapterIndex !== this.currentScene.chapterIndex 
        || this.currentScene.sceneIndex === -1
        || (this.currentScene.sceneIndex + 1) >= this.chapterDetails.scenePaths.length
      ) {
        this.postProgressChapter();
        this.$loadChapter();
        nextSceneIndex = 0;
      }
      
      logger(`nextSceneIndex (${nextSceneIndex})`);
      const nextScenePath = `${this.chapterDetails.scenePaths[nextSceneIndex]}.json`
      logger(`nextScenePath (${nextScenePath})`);

      fetch(nextScenePath)
        .then((resp) => {
          if (resp.ok) return resp.json();
        })
        .then((resJson) => {
          logger(`${JSON.stringify(resJson)}`);
          this.currentScene.sceneIndex = nextSceneIndex;
          this.currentScene.chapterIndex = this.chapterDetails.chapterIndex;
          const newSceneData = {...resJson} as INewScene
          // set BMG
          this._updateBgm(newSceneData.bgm);
          this._updateBackdrop(newSceneData.backdrop);
          this._updateChars(newSceneData.chars);
          this._updateText(newSceneData.initialText);
          this._updateTransitions(newSceneData.transitions);
          this._updateDescription(newSceneData.description);
          this._updateEffect(newSceneData.effect || 'off');
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
      logger('$loadChapter');
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
    },
    _updateBgm(newBgm: IBGM){
      this.currentScene.activeBmg = newBgm;
    }, 
    _updateBackdrop(newBackdrop: IBackdrop){
      if (newBackdrop.path !== ''){
        this.currentScene.backdrop = newBackdrop;
      }
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
      this._updateChars([...(newTransition.chars)])
      this._updateEffect(newTransition.effect || 'off');
      // add stuff relating to delay limiting
      // this.currentScene
      this.$writeHistory();
    },
    _updateDescription(newDesc: string){
      this.currentScene.description = newDesc;
    },
    _updateEffect(newEffect: string){      
      const effectName: EffectType = (newEffect as EffectType) || 'off';
      this.currentScene.effect = effectName;
    },
  },
})


function logger(message: string){
  trace(`${LOGGING_PREFIX}${message}`);
}