import { runOnJS } from 'react-native-reanimated';

type LogType = (...params: any[]) => void;

let isLoggingEnabled = false;
let displayTimestamp = false;

const enableNotifierLogging = (enableTimestamp?: boolean) => {
  if (!__DEV__) {
    console.warn('[Notifier] logger available only in DEV mode!');
    return;
  }
  displayTimestamp = enableTimestamp ?? false;
  isLoggingEnabled = true;
};

let notifierLog: LogType = () => {};

if (__DEV__) {
  notifierLog = (...params) => {
    if (!isLoggingEnabled) {
      return;
    }

    if (displayTimestamp) {
      params = [Date.now(), ...params];
    }

    console.log(`[Notifier]`, ...params);
  };
}

const notifierLogWorklet: LogType = (...params) => {
  'worklet';
  runOnJS(notifierLog)(...params);
};

export { notifierLog, enableNotifierLogging, notifierLogWorklet };
