import React from 'react';
import { NotifierRoot } from './Notifier';
import { ShowNotification } from './types';

interface NotifierWrapperProps extends ShowNotification {
  children: React.ReactNode;
}

export const NotifierWrapper = ({ children, ...defaultParams }: NotifierWrapperProps) => (
  <>
    {children}
    <NotifierRoot {...defaultParams} />
  </>
);
