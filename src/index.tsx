import { NativeModules } from 'react-native';

type NotifierType = {
  getDeviceName(): Promise<string>;
};

const { Notifier } = NativeModules;

export default Notifier as NotifierType;
