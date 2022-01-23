import { iNotification, iNotificationCustomType } from 'src/components/Notification';
interface iStore {
    addNotification(notification: iNotification): string;
    removeNotification(id: string): void;
    register(param: iRegisterParams): void;
}
interface iRegisterParams {
    addNotification: (notification: iNotification) => string;
    removeNotification: (id: string) => void;
    removeAllNotifications: () => void;
    types: iNotificationCustomType[];
    defaultNotificationWidth: number;
}
declare class Store implements iStore {
    constructor();
    removeNotification: (id: string) => void;
    removeAllNotifications: () => void;
    private types;
    private add;
    private defaultNotificationWidth;
    private counter;
    private incrementCounter;
    addNotification(notification: iNotification): string;
    getCounter: () => number;
    register(parameters: iRegisterParams): void;
}
declare const _default: Store;
export default _default;
