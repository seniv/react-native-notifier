import React from 'react';
import { Animated } from 'react-native';
import { Notification as NotificationComponent } from './components';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_DURATION,
  DEFAULT_SWIPE_ENABLED,
  SWIPE_ANIMATION_DURATION,
  SWIPE_PIXELS_TO_CLOSE,
} from './constants';
import type {
  ShowNotificationParams,
  StateInterface,
  NotifierInterface,
  NotifierProps,
} from './types';
import { FullWindowOverlay } from '../components/FullWindowOverlay';
import { NotifierRenderer } from './NotifierRenderer/NotifierRenderer';

export const Notifier: NotifierInterface = {
  showNotification: () => {},
  hideNotification: () => {},
  clearQueue: () => {},
};

export class NotifierRoot extends React.PureComponent<
  NotifierProps,
  StateInterface
> {
  private isShown: boolean;
  private callStack: Array<ShowNotificationParams>;
  private notificationRef: any;

  constructor(props: NotifierProps) {
    super(props);

    this.state = {
      currentNotification: undefined,
    };

    this.isShown = false;
    this.notificationRef = React.createRef();
    this.callStack = [];

    this.onHidden = this.onHidden.bind(this);

    this.showNotification = this.showNotification.bind(this);
    this.hideNotification = this.hideNotification.bind(this);
    this.clearQueue = this.clearQueue.bind(this);

    if (!props.omitGlobalMethodsHookup) {
      Notifier.showNotification = this.showNotification;
      Notifier.hideNotification = this.hideNotification;
      Notifier.clearQueue = this.clearQueue;
    }
  }

  public hideNotification(callback?: Animated.EndCallback) {
    if (!this.isShown) {
      return;
    }

    this.notificationRef.current?.hideNotification?.(callback);
  }

  public showNotification<
    ComponentType extends React.ElementType = typeof NotificationComponent,
  >(functionParams: ShowNotificationParams<ComponentType>) {
    const {
      // Remove "omitGlobalMethodsHookup" prop as it is only utilized within the constructor and is redundant elsewhere.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      omitGlobalMethodsHookup,
      // Remove "useRNScreensOverlay" and "rnScreensOverlayViewStyle" as it is only used in the render
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useRNScreensOverlay,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rnScreensOverlayViewStyle,
      ...props
    } = this.props;

    const params = {
      ...props,
      ...functionParams,
      componentProps: {
        ...props?.componentProps,
        ...functionParams?.componentProps,
      },
    };

    const { queueMode, ...notificationParams } = params;

    if (this.isShown) {
      switch (queueMode) {
        case 'standby': {
          this.callStack.push(params);
          break;
        }
        case 'next': {
          this.callStack.unshift(params);
          break;
        }
        case 'immediate': {
          this.callStack.unshift(params);
          this.hideNotification();
          break;
        }
        default: {
          this.callStack = [params];
          this.hideNotification();
          break;
        }
      }
      return;
    }

    this.setState({
      currentNotification: {
        ...notificationParams,
        Component: notificationParams.Component ?? NotificationComponent,
        swipeEnabled: notificationParams.swipeEnabled ?? DEFAULT_SWIPE_ENABLED,
        showAnimationDuration:
          notificationParams?.showAnimationDuration ??
          notificationParams?.animationDuration ??
          DEFAULT_ANIMATION_DURATION,
        hideAnimationDuration:
          notificationParams?.hideAnimationDuration ??
          notificationParams?.animationDuration ??
          DEFAULT_ANIMATION_DURATION,
        duration: notificationParams.duration ?? DEFAULT_DURATION,
        swipePixelsToClose:
          notificationParams?.swipePixelsToClose ?? SWIPE_PIXELS_TO_CLOSE,
        swipeAnimationDuration:
          notificationParams?.swipeAnimationDuration ??
          SWIPE_ANIMATION_DURATION,
        showEasing:
          notificationParams?.showEasing ?? notificationParams?.easing,
        hideEasing:
          notificationParams?.hideEasing ?? notificationParams?.easing,
      },
    });
    this.isShown = true;
  }

  public clearQueue(hideDisplayedNotification?: boolean) {
    this.callStack = [];

    if (hideDisplayedNotification) {
      this.hideNotification();
    }
  }

  private onHidden() {
    this.setState({
      currentNotification: undefined,
    });
    requestAnimationFrame(() => {
      this.isShown = false;

      const nextNotification = this.callStack.shift();
      if (nextNotification) {
        this.showNotification(nextNotification);
      }
    });
  }

  render() {
    const { useRNScreensOverlay, rnScreensOverlayViewStyle } = this.props;

    return (
      <FullWindowOverlay
        useOverlay={useRNScreensOverlay}
        viewStyle={rnScreensOverlayViewStyle}
      >
        {this.state.currentNotification ? (
          <NotifierRenderer
            notification={this.state.currentNotification}
            onHiddenCallback={this.onHidden}
            ref={this.notificationRef}
          />
        ) : null}
      </FullWindowOverlay>
    );
  }
}
