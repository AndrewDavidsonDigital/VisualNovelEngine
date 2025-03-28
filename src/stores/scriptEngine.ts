import { defineStore } from 'pinia'
import { IBGM, IBackdrop, IChar, IChoice, IGameScript, IHistoryEntry, IInitialText, INewScene, IScriptEngine, IText, ITransition } from './interfaces';
import { trace } from '@lib/logging';
import { EffectType } from '@components/layers/Effectslay.vue';

const LOGGING_PREFIX = '📕 Scripting Engine:\t';

interface ISaveData {
  chapterIndex: number;
  sceneIndex: number;
  transitionIndex: number;
}

interface ISave {
  title: string,
  chapterIndex: number | string,
  sceneIndex: number | string,
  transitionIndex: number | string,
  active?: boolean,
  dateTime: number,
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
        isLastScene: false,
        isChoice: false,
        optionKey: '',
        options: [],
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
        effectData: undefined,
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
    isChoice(): boolean{
      logger('isChoice');
      return this.currentScene.isChoice || false
    },
    getChoices(): IChoice[]{
      logger('getChoices');
      return this.currentScene.options || [];
    }
  },
  actions: {
    _loadCallback(trIndex: number = -1){
      logger('_loadCallback');
      logger(`trIndex: ${trIndex}`);
      // do nothing, this is just a hook
    },
    loadGameState(state: ISave){
      logger('loadGameState');
      logger(JSON.stringify(state))
      const cpIndex = Number(state.chapterIndex);
      const scIndex = Number(state.sceneIndex);
      const trIndex = Number(state.transitionIndex);
      if (cpIndex >= 1){
        this.currentScene.chapterIndex = cpIndex -1;
        this.chapterDetails.chapterIndex = cpIndex -1;
      }
      this.currentScene.sceneIndex = scIndex -1;
      
      // de-index as we will pre-load one before so player loads NEXT scene (i.e. the one we want.)
      this.currentScene.transitionIndex = trIndex -1;

      this.$loadScene();

      setTimeout(() => {
        logger('loadGameState_timer');
        const nextTransition: ITransition = this.currentScene.transitions[this.currentScene.transitionIndex];
        logger(JSON.stringify(this.currentScene));
        logger(JSON.stringify(this.currentScene.transitions));
        if (trIndex !== 0){
          logger('loadGameState_timer: loading a transition');
          logger(JSON.stringify(nextTransition));
          this._updateTransition(nextTransition)
        }
        this._loadCallback(trIndex -1);
      },
      200);

    },
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
    skipForwards(){
      logger('skipForwards');
      this.$loadScene();
    },
    progressChoice(choice: IChoice){
      logger(`progressChoice ${JSON.stringify(choice)}`);
      if (this.currentScene.isLastScene){
        logger('progressChoice_end');
        return
      }
      let nextSceneIndex = this.chapterDetails.scenePaths.indexOf(choice.jump)
      if (nextSceneIndex === -1){
        nextSceneIndex = 0;
      }
      this.$writeChoiceHistory({
        actor: 'user',
        choice: choice.value,
      });
      this.__callScene(`${choice.jump}.json`, 99);
      logger('progressChoice_CleanUp');
      this.currentScene.options = [];
      this.currentScene.optionKey = '';
      this.currentScene.isChoice = false;
      logger('progressChoice_end');
    },
    progress(){
      logger('progress');
      // escape if we need to choose a choice instead
      if (this.currentScene.isChoice || this.currentScene.isLastScene){
        logger('progress_end');
        return
      }
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
      this.__callScene(nextScenePath, nextSceneIndex)
    },
    __callScene(scenePath: string, nextSceneIndex: number){
      fetch(scenePath)
        .then((resp) => {
          if (resp.ok) return resp.json();
        })
        .then((resJson) => {
          logger(`${JSON.stringify(resJson)}`);
          this.currentScene.sceneIndex = nextSceneIndex;
          this.currentScene.chapterIndex = this.chapterDetails.chapterIndex;
          this.currentScene.options = null;
          this.currentScene.optionKey = '';
          const newSceneData = {...resJson} as INewScene
          
          this._updateBgm(newSceneData.bgm);
          this._updateBackdrop(newSceneData.backdrop);
          this._updateChars(newSceneData.chars);
          if (newSceneData.initialText){
            this._updateText(newSceneData.initialText);
          }else{
            const extractedTextFormat: IInitialText = {
              ...newSceneData.transitions[0].text,
              delay: newSceneData.transitions[0].delay || {
                min: 0,
                default: 0
              }
            }
            this._updateText(extractedTextFormat);
          }
          this._updateTransitions(newSceneData.transitions);
          this._updateDescription(newSceneData.description);
          this._updateEffect(newSceneData.initialEffect || 'off', newSceneData.initialEffectData);
          
          // set to 1 as the 0'th index is the initial text and we want to start with the first transition  
          this.currentScene.transitionIndex = 1;

          if (this.gameScript?.chapters){
            const isLastChap = this.currentScene.chapterIndex >= (this.gameScript?.chapters.length - 1);
            const isLastScene = this.currentScene.sceneIndex >= (this.chapterDetails.scenePaths.length -1);
            this.currentScene.isLastScene = isLastChap && isLastScene;
          }
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
    $writeChoiceHistory(obj: {
      actor: string,
      choice: string,
    }){

      const currentEntry: IHistoryEntry = {
        actorName: '',
        text: obj.choice,
        audioPath: '',
        isChoice: true,
      }

      if (!(this.chapterDetails.history)){
        this.chapterDetails.history = [];
      }
      this.chapterDetails.history.push(currentEntry);
    },
    _updateBgm(newBgm: IBGM){
      logger(`_updateBgm ${JSON.stringify(newBgm)}`);
      this.currentScene.activeBmg = newBgm;
    }, 
    _updateBackdrop(newBackdrop: IBackdrop){
      logger(`_updateBackdrop ${JSON.stringify(newBackdrop)}`);
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
      logger(`_updateTransition ${JSON.stringify(newTransition)}`);
      const isChoice = (newTransition?._discriminator && newTransition._discriminator === 'IChoice') || false;
      this.currentScene.isChoice = isChoice;

      if (isChoice && newTransition?.options && newTransition.options.length > 0 && newTransition.optionKey){
        this._updateOptions(newTransition.options, newTransition.optionKey);
      }else{
        this.currentScene.options = null;
        this.currentScene.optionKey = '';
      }

      this.currentScene.text = {...(newTransition.text)}
      this._updateChars([...(newTransition.chars)])
      this._updateEffect(newTransition.effect || 'off', newTransition.effectData);
      // add stuff relating to delay limiting
      // this.currentScene
      this.$writeHistory();
    },
    _updateDescription(newDesc: string){
      this.currentScene.description = newDesc;
    },
    _updateEffect(newEffect: string, newEffectData?: any){      
      const effectName: EffectType = (newEffect as EffectType) || 'off';
      this.currentScene.effect = effectName;
      if (newEffectData){
        this.currentScene.effectData = newEffectData;
      } else {
        this.currentScene.effectData = undefined;
      }
    },
    _updateOptions(newOptoins: IChoice[], key:string){
      this.currentScene.options = [...newOptoins];
      this.currentScene.optionKey = key;
    }
  },
})


function logger(message: string){
  trace(`${LOGGING_PREFIX}${message}`);
}