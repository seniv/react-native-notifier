import React, { forwardRef } from 'react';
import { NotifierRoot } from './Notifier';
import type { ShowNotificationParams } from './types';

interface NotifierWrapperProps extends ShowNotificationParams {
  children: React.ReactNode;
}

export const NotifierWrapper = forwardRef<NotifierRoot, NotifierWrapperProps>(
  ({ children, ...defaultParams }, ref) => (
    <>
      {children}
      <NotifierRoot ref={ref} {...defaultParams} />
    </>
  )
);
