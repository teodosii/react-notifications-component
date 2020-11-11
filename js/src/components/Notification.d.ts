import React from 'react';
import { iNotification } from 'src/types/Notification';
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
    componentDidUpdate({ hasBeenRemoved }: iNotificationProps): void;
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
