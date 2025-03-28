import { EffectExtraDataType, EffectType } from "@components/layers/Effectslay.vue";

export interface IGameScript {
  chapters: IGameChapter[],
}
export interface IGameChapter {
  title: string,
  displayTitle: boolean,
  scenePaths: string[],
  history?: IHistoryEntry[]
}

export interface IHistoryEntry {
  actorName: string,
  text: string,
  audioPath: string,
  isChoice?: boolean;
}

export interface IScriptEngine {
  chapterDetails: IChapter & IGameChapter;
  currentScene: IScene;
  gameScript?: IGameScript;
}

export interface IChapter {
  chapterIndex: number,
  path?: string,
}

export interface IScene {
  isLastScene: boolean;
  isChoice: boolean;
  optionKey: string;
  options: IChoice[] | null;
  chapterIndex: number;
  sceneIndex: number;
  transitionIndex: number;
  description: string;
  activeChars: Array<IChar>;
  activeBmg: IBgm;
  effect: EffectType;
  effectData?: EffectExtraDataType;
  text: IText;
  backdrop: IBackdrop;
  transitions: ITransition[];
}

export interface INewScene {
  chars: IChar[];
  bgm: IBgm;
  backdrop: IBackdrop;
  description: string;
  initialEffect?: EffectType,
  initialEffectData?: EffectExtraDataType,
  transitions: ITransition[];
  initialText: IInitialText;
}

export interface IInitialText {
  speaker: string,
  text: string,
  position: Location,
  voice: string,
  delay: {
    min: number,
    default: number
  }
}

export type Transition = 'IChoice'

export interface ITransition {
  _discriminator?: Transition,
  chars: IChar[],
  optionKey?: string;
  options?: IChoice[],
  text: IText,
  delay?: {
    min: number,
    default: number
  },
  effect?: EffectType,
  effectData?: any,
}
export interface IChoice {
  value : string;
  jump  : string;
}
export interface IText {
  speaker: string,
  text: string,
  position: Location,
  voice: string
}
export interface IBackdrop {
  path: string;
  type: BackdropType;
}

export interface IBgm {
  path: string;
  forceRestart?: string;
}

export interface IChar {
  path: string,
  positioning: Location
}

export type Location = 'left' | 'centerLeft' | 'center' |  'centerRight' | 'right' 
export type BackdropType = 'image' | 'video'
