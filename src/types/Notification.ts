import {
  INSERTION,
  NOTIFICATION_CONTAINER,
  NOTIFICATION_TYPE
} from 'src/utils/constants';

export interface iNotification {
  id?: string;
  onRemoval?: Function;
  title?: NotificationTitleMessage;
  message?: NotificationTitleMessage;
  content?: NotificationContent;
  type?: NOTIFICATION_TYPE;
  container?: NOTIFICATION_CONTAINER;
  insert?: INSERTION;
  dismiss?: iDismiss;
  animationIn?: string[];
  animationOut?: string[];
  slidingEnter?: iTransition;
  slidingExit?: iTransition;
  touchRevert?: iTransition;
  touchSlidingExit?: iTouchTransition;
  userDefinedTypes?: iNotificationCustomType[];
  width?: number;
  removed?: boolean
}

export type NotificationTitleMessage = string | React.ReactNode | React.FunctionComponent;
export type NotificationContent =
  | React.ComponentClass<any, any>
  | React.FunctionComponent<any>
  | React.ReactElement;

export interface iTransition {
  duration: number;
  timingFunction: string;
  delay: number;
}

export interface iTouchTransition {
  swipe: iTransition;
  fade: iTransition;
}

export interface iDismiss {
  duration: number;
  onScreen: boolean;
  pauseOnHover: boolean;
  waitForAnimation: boolean;
  click: boolean;
  touch: boolean;
  showIcon: boolean;
}

export interface iNotificationCustomType {
  htmlClasses: string[];
  name: string;
}
