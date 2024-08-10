import { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type {
  NotifierState,
  ShowNotificationParams,
  ShowParams,
  StateInterface,
  SwipeDirection,
} from '../types';

export interface NotifierInternalContext {
  animationDriver: SharedValue<number>;
  hiddenTranslateXValue: SharedValue<number>;
  hiddenTranslateYValue: SharedValue<number>;
  translationX: SharedValue<number>;
  translationY: SharedValue<number>;
  componentHeight: SharedValue<number>;
  componentWidth: SharedValue<number>;
  notifierState: SharedValue<NotifierState>;
  swipeDirection: SharedValue<SwipeDirection>;

  showParams: React.MutableRefObject<ShowParams | null>;
  hideTimer: React.MutableRefObject<NodeJS.Timeout | undefined>;
  callStack: React.MutableRefObject<
    ShowNotificationParams<React.ElementType>[]
  >;

  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;

  resetHiddenTranslateValues: () => void;
  resetGestures: () => void;
  resetTimer: () => void;
}

export const NotifierInternalContext =
  createContext<NotifierInternalContext | null>(null);

export const NotifierInternalProvider = NotifierInternalContext.Provider;

export const useNotifierInternal = () => {
  const context = useContext(NotifierInternalContext);

  if (context === null) {
    throw "'useNotifierInternal' cannot be used out of the NotifierRoot!";
  }

  return context!;
};
