export type StorageKeys = 
  'illusionEngine_logging' | 
  'illusionEngine_config' | 
  'illusionEngine_state' | 
  'illusionEngine_CG' | 
  'illusionEngine_complete'
;

export function has(key: StorageKeys){
  return window.localStorage.getItem(key) !== null;
}

function get(key: StorageKeys){
  return window.localStorage.getItem(key);
}

function set(key: StorageKeys, value: string){
  return window.localStorage.setItem(key, value);
}

export function useCurrentGame() {
  return {
    'get'  : () => get('illusionEngine_CG'),
    'set'  : (value: string) => set('illusionEngine_CG', value),
    '$set' : (value: object) => set('illusionEngine_CG', JSON.stringify(value)),
    'clear': () => set('illusionEngine_CG', '{}')
  }
}

export function useCompleteGame() {
  return {
    'get'  : () => get('illusionEngine_complete'),
    'set'  : (value: string) => set('illusionEngine_complete', value),
    '$set' : (value: object) => set('illusionEngine_complete', JSON.stringify(value)),
    'clear': () => set('illusionEngine_complete', '{}')
  }
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