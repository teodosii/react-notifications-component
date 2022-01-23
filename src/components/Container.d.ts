import React from 'react';
import 'src/scss/notification.scss';
import type { iNotification, iNotificationCustomType } from 'src/components/Notification';
interface iContainerProps {
    isMobile?: boolean;
    breakpoint?: number;
    types?: iNotificationCustomType[];
    defaultNotificationWidth?: number;
}
interface iContainerState {
    isMobile: boolean;
    breakpoint: number;
    notifications: iNotification[];
    windowWidth: number;
}
declare class Container extends React.Component<iContainerProps, iContainerState> {
    constructor(props: iContainerProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleResize: () => void;
    add: (notification: iNotification) => string;
    remove: (id: string) => void;
    removeAllNotifications: () => void;
    toggleRemoval: (id: string, callback: () => void) => void;
    renderNotifications(notifications: iNotification[], isMobile: boolean): JSX.Element[];
    renderMobileNotifications(props: any): JSX.Element;
    renderScreenNotifications(props: any): JSX.Element;
    render(): JSX.Element;
}
export default Container;
