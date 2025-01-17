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
import {
  animationConfigs,
  animationFunctions,
  shakingConfigs,
} from '../parameters';

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
    animationFunction: params.animationFunction ?? animationFunctions.slide,
    position,
    enterFrom,
    exitTo: params.exitTo ?? enterFrom ?? 'top',
    swipeDirection: params.swipeDirection ?? enterFrom ?? 'top',
    ignoreKeyboard: params.ignoreKeyboard ?? Platform.OS === 'web',
    ignoreKeyboardHeight:
      params.ignoreKeyboardHeight ?? Platform.OS === 'android',
    additionalKeyboardOffset: params.additionalKeyboardOffset ?? 0,
    showAnimationConfig:
      params.showAnimationConfig ??
      (params.Component === AlertComponent
        ? animationConfigs.timing300
        : animationConfigs.spring),
    hideAnimationConfig:
      params.hideAnimationConfig ?? animationConfigs.timing300,
    swipeOutAnimationConfig:
      params.swipeOutAnimationConfig ?? animationConfigs.timing200,
    resetSwipeAnimationConfig:
      params.resetSwipeAnimationConfig ?? animationConfigs.timing200,
    shakingConfig:
      params.shakingConfig ??
      (params.Component === AlertComponent
        ? shakingConfigs.onlyUp
        : shakingConfigs.horizontal),
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
