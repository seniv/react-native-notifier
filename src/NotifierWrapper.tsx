import React from 'react';
import { NotifierRoot } from './Notifier';

interface NotifierWrapperProps {
  children: React.ReactNode;
}

export const NotifierWrapper = ({ children }: NotifierWrapperProps) => (
  <>
    {children}
    <NotifierRoot />
  </>
);
