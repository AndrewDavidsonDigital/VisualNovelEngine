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
  chapterIndex: number;
  sceneIndex: number;
  transitionIndex: number;
  activeChars: Array<IChar>;
  activeBmg: IBGM;
  text: IText,
  backdrop: IBackdrop;
  transitions: ITransition[];
}

export interface INewScene {
  chars: IChar[];
  bgm: IBGM;
  backdrop: IBackdrop;
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
export interface ITransition {
  chars : IChar[],
  text: IText,
  delay : {
    min: number,
    default: number
  }
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

export interface IBGM {
  path: string;
  forceRestart?: string;
}

export interface IChar {
  path: string,
  positioning: Location
}

export type Location = 'left' | 'centerLeft' | 'center' |  'centerRight' | 'right' 
export type BackdropType = 'image' | 'video'
