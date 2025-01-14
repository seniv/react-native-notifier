import React, { forwardRef } from 'react';
import { NotifierRoot } from './Notifier';
import type { NotifierInterface, NotifierProps } from '../types';

interface NotifierWrapperProps extends NotifierProps {
  children: React.ReactNode;
}

export const NotifierWrapper = forwardRef<
  NotifierInterface,
  NotifierWrapperProps
>(({ children, ...defaultParams }, ref) => (
  <>
    {children}
    <NotifierRoot ref={ref} {...defaultParams} />
  </>
));

export type NotifierWrapper = NotifierInterface;

NotifierWrapper.displayName = 'ForwardRef(NotifierWrapper)';
