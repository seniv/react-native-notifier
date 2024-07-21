import React, { forwardRef } from 'react';
import { NotifierRoot } from './Notifier';
import type { NotifierProps } from './types';

interface NotifierWrapperProps extends NotifierProps {
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
