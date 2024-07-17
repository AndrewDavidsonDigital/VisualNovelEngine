interface ILoggingConfig {
  trace: boolean;
  debug: boolean;
}

const KEY = 'illusionEngine_logging';

const loggingConfig = (JSON.parse(window.localStorage.getItem(KEY) || '{ "trace": true, "debug": true }')) as ILoggingConfig;
window.localStorage.setItem(KEY, JSON.stringify(loggingConfig));

export function trace(message: string){  
  if (loggingConfig.trace){
    console.log(`${Date.now()} ${message}`);
  }
}
export function debug(message: string){  
  if (loggingConfig.debug){
    console.log(`${Date.now()} ${message}`);
  }
}