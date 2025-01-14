import type React from 'react';
import { Platform } from 'react-native';
import hashSum from 'hash-sum';
import type {
  Direction,
  Notification,
  Position,
  ShowNotificationParams,
} from '../types';
import {
  Notification as NotificationComponent,
  Alert as AlertComponent,
} from '../ui-components';
import { slide as slideAnimationFunction } from './animationFunctions';
import {
  spring as springAnimationConfig,
  timing200 as timing200AnimationConfig,
  timing300 as timing300AnimationConfig,
} from './animationConfigs';
import {
  horizontal as horizontalShakingConfig,
  onlyUp as onlyUpShakingConfig,
} from './shakingConfigs';

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
  Required<Pick<ShowNotificationParams, 'queueMode' | 'duplicateBehavior'>>;
export const getNotificationParameters = ({
  defaultParamsProps,
  functionParams,
}: GetNotificationParametersParams): GetNotificationParametersReturnType => {
  const { idStrategy, ...params } = {
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

  const paramsResult = {
    ...params,
    Component: params.Component ?? NotificationComponent,
    duration: params.duration ?? 3000,
    swipePixelsToClose: params?.swipePixelsToClose ?? 20,
    animationFunction: params.animationFunction ?? slideAnimationFunction,
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
    shakingConfig:
      params.shakingConfig ??
      (params.Component === AlertComponent
        ? onlyUpShakingConfig
        : horizontalShakingConfig),
    duplicateBehavior: params.duplicateBehavior ?? 'shakeAndResetTimer',
    queueMode: params.queueMode ?? 'reset',
  };

  let id = paramsResult.id;
  if (!id) {
    if (idStrategy === 'random') {
      id = Math.random();
    } else {
      id = hashSum(paramsResult);
    }
  }

  return { id, ...paramsResult };
};
