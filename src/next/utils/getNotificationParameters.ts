import type React from 'react';
import type {
  Direction,
  Notification,
  Position,
  ShowNotificationParams,
} from '../types';
import { DEFAULT_DURATION, SWIPE_PIXELS_TO_CLOSE } from '../constants';
import {
  Notification as NotificationComponent,
  Alert as AlertComponent,
} from '../components';
import { defaultAnimationFunction } from '../NotifierRenderer/NotifierRenderer.helpers';
import { Platform } from 'react-native';
import {
  spring as springAnimationConfig,
  timing200 as timing200AnimationConfig,
  timing300 as timing300AnimationConfig,
} from './animationConfigs';

const getDefaultEnterFromBasedOnPosition = (position?: Position): Direction => {
  if (!position) return 'top';

  switch (position) {
    case 'top':
    case 'bottom':
      return position;
    case 'topLeft':
    case 'bottomLeft':
      return 'left';
    case 'topRight':
    case 'bottomRight':
      return 'right';
  }
};

interface GetNotificationParametersParams {
  defaultParamsProps: React.RefObject<
    ShowNotificationParams<React.ElementType>
  >;
  functionParams: ShowNotificationParams;
}
type GetNotificationParametersReturnType = Notification &
  Pick<ShowNotificationParams, 'queueMode'>;
export const getNotificationParameters = ({
  defaultParamsProps,
  functionParams,
}: GetNotificationParametersParams): GetNotificationParametersReturnType => {
  const params = {
    ...defaultParamsProps.current,
    ...functionParams,
    componentProps: {
      ...defaultParamsProps.current?.componentProps,
      ...functionParams?.componentProps,
    },
  };

  const position = params.position ?? 'top';
  const enterFrom =
    params.enterFrom ?? getDefaultEnterFromBasedOnPosition(position);

  return {
    ...params,
    id: params.id ?? Math.random(),
    Component: params.Component ?? NotificationComponent,
    duration: params.duration ?? DEFAULT_DURATION,
    swipePixelsToClose: params?.swipePixelsToClose ?? SWIPE_PIXELS_TO_CLOSE,
    animationFunction: params.animationFunction ?? defaultAnimationFunction,
    position,
    enterFrom,
    exitTo: params.exitTo ?? enterFrom ?? 'top',
    swipeDirection: params.swipeDirection ?? enterFrom ?? 'top',
    ignoreKeyboard: params.ignoreKeyboard ?? Platform.OS !== 'ios',
    additionalKeyboardOffset: params.additionalKeyboardOffset ?? 0,
    showAnimationConfig:
      params.showAnimationConfig ??
      (params.Component === AlertComponent
        ? timing300AnimationConfig
        : springAnimationConfig),
    hideAnimationConfig: params.hideAnimationConfig ?? timing300AnimationConfig,
    swipeOutAnimationConfig:
      params.swipeOutAnimationConfig ?? timing200AnimationConfig,
    resetSwipeAnimationConfig:
      params.resetSwipeAnimationConfig ?? timing200AnimationConfig,
  };
};
