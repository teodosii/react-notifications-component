import React from 'react';
import { INSERTION, NOTIFICATION_CONTAINER, NOTIFICATION_TYPE } from '../utils/constants';
export type { iNotification, iTransition, iTouchTransition, iDismiss, iNotificationCustomType };
interface iNotification {
    id?: string;
    onRemoval?: (id: string, removalFlag: string) => void;
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
    touchSlidingExit?: {
        fade: iTransition;
        swipe: iTransition;
    };
    userDefinedTypes?: iNotificationCustomType[];
    width?: number;
    hasBeenRemoved?: boolean;
}
export declare type NotificationTitleMessage = string | React.ReactNode | React.FunctionComponent;
export declare type NotificationContent = React.ComponentClass<any, any> | React.FunctionComponent<any> | React.ReactElement;
interface iTransition {
    duration: number;
    timingFunction: string;
    delay: number;
}
interface iTouchTransition {
    swipe: iTransition;
    fade: iTransition;
}
interface iDismiss {
    duration: number;
    onScreen: boolean;
    pauseOnHover: boolean;
    waitForAnimation: boolean;
    click: boolean;
    touch: boolean;
    showIcon: boolean;
}
interface iNotificationCustomType {
    htmlClasses: string[];
    name: string;
}
declare class iNotificationProps {
    id: string;
    notification: iNotification;
    defaultNotificationWidth: number;
    notificationsCount: number;
    isMobile: boolean;
    hasBeenRemoved: boolean;
    toggleRemoval: (id: string, callback: () => void) => void;
}
interface iNotificationState {
    parentStyle?: iParentStyle;
    htmlClassList?: string[];
    animationPlayState?: string;
    touchEnabled?: boolean;
    onTransitionEnd?: (event: React.TransitionEvent<HTMLDivElement>) => void;
    onAnimationEnd?: (event: React.AnimationEvent<HTMLDivElement>) => void;
    startX?: number;
    currentX?: number;
}
interface iParentStyle {
    height?: string;
    overflow?: string;
    width?: string;
    transition?: string;
}
declare class Notification extends React.Component<iNotificationProps, iNotificationState> {
    constructor(props: iNotificationProps);
    private readonly rootElementRef;
    private timer;
    componentWillUnmount(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: iNotificationProps): void;
    removeNotification(removalFlag: string): void;
    onClick: () => void;
    onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void;
    onTouchMove: (event: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    renderTimer(): JSX.Element;
    renderCustomContent(): JSX.Element;
    renderNotification(): JSX.Element;
    render(): JSX.Element;
}
export default Notification;
