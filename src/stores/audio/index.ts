import { useBgmEngine } from "./bgmEngine";
import { useInteractionEngine } from "./interactionEngine";
import { useSfxEngine } from "./sfxEngine";
import { useVoiceEngine } from "./voiceEngine";

export {
  useBgmEngine,
  useSfxEngine,
  useVoiceEngine,
  useInteractionEngine,
};

export type AudioState = 'off' | 'paused' | 'play';
export interface IAudioEngine {
  domId: string,
  el: HTMLAudioElement | null,
  count: number,
  status: AudioState,
  volumeMultiplier: number;
}
