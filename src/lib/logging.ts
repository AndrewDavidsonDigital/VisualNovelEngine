interface ILoggingConfig {
  trace: boolean;
}

const KEY = 'illusionEngine_logging';

const loggingConfig = (JSON.parse(window.localStorage.getItem(KEY) || '{ "trace": true }')) as ILoggingConfig;
window.localStorage.setItem(KEY, JSON.stringify(loggingConfig));

export function trace(message: string){  
  if (loggingConfig.trace){
    console.log(`${Date.now()} ${message}`);
  }
}