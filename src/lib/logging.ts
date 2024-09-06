import { useLogging } from "@lib/storage";

interface ILoggingConfig {
  trace: boolean;
  debug: boolean;
}

const loggingStorage = useLogging();

const loggingConfig = JSON.parse((loggingStorage.get() || '{ "trace": true, "debug": true }')) as ILoggingConfig;
loggingStorage.set(JSON.stringify(loggingConfig));

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