import type { AnimationConfig } from '../types';

export const spring: AnimationConfig = {
  method: 'spring',
  config: {
    friction: 8,
  },
};

export const timing300: AnimationConfig = {
  method: 'timing',
  config: {
    duration: 300,
  },
};

export const timing200: AnimationConfig = {
  method: 'timing',
  config: {
    duration: 200,
  },
};
