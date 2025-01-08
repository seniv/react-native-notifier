import type { Direction, Position } from '../types';

export const getDefaultEnterFromBasedOnPosition = (
  position?: Position
): Direction => {
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
