export type StorageKeys = 'illusionEngine_logging' | 'illusionEngine_config' | 'illusionEngine_state';

export function has(key: StorageKeys){
  return window.localStorage.getItem(key) !== null;
}

function get(key: StorageKeys){
  return window.localStorage.getItem(key);
}

function set(key: StorageKeys, value: string){
  return window.localStorage.setItem(key, value);
}

export function useStorage() {
  return {
    'get': () => get('illusionEngine_state'),
    'set': (value: string) => set('illusionEngine_state', value)
  }
}

export function useLogging() {
  return {
    'get': () => get('illusionEngine_logging'),
    'set': (value: string) => set('illusionEngine_logging', value)
  }
}

export function useConfig() {
  return {
    'get': () => get('illusionEngine_config'),
    'set': (value: string) => set('illusionEngine_config', value)
  }
}