import { createRef } from 'react';
import { Platform } from 'react-native';
import type { NotifierRoot } from 'react-native-notifier/next';

export const notifierRef = createRef<NotifierRoot>();
export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';
