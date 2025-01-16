import type { ShakingConfig } from '../types';

export const horizontal: ShakingConfig = {
  minValue: -5,
  maxValue: 5,
  vertical: false,
  numberOfRepeats: 3,
  duration: 50,
};

export const vertical: ShakingConfig = {
  minValue: -5,
  maxValue: 5,
  vertical: true,
  numberOfRepeats: 3,
  duration: 50,
};

export const onlyUp: ShakingConfig = {
  minValue: -5,
  maxValue: 0,
  vertical: true,
  numberOfRepeats: 3,
  duration: 50,
};
