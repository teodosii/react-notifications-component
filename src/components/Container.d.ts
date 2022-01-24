import React from 'react';
import { iContainerProps, iContainerState, iNotification } from 'src/types';
import 'src/scss/notification.scss';
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
//# sourceMappingURL=Container.d.ts.map