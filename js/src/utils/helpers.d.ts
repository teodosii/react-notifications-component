import { iNotification, iNotificationCustomType, iTransition } from 'src/types/Notification';
import { NOTIFICATION_TYPE } from 'src/utils/constants';
export declare const isNull: (object: any) => boolean;
export declare function isBottomContainer(container: string): boolean;
export declare function isTopContainer(container: string): boolean;
export declare function hasFullySwiped(diffX: number, width: number): boolean;
export declare function shouldNotificationHaveSliding(notification: iNotification, count: number): boolean;
export declare function htmlClassesForExistingType(type: NOTIFICATION_TYPE): string[];
export declare function getHtmlClassesForType(notification: iNotification): string[];
export declare function getNotificationsForMobileView(notifications: iNotification[]): {
    top: iNotification[];
    bottom: iNotification[];
};
export declare function getNotificationsForEachContainer(notifications: iNotification[]): {
    topFull: iNotification[];
    bottomFull: iNotification[];
    topLeft: iNotification[];
    topRight: iNotification[];
    topCenter: iNotification[];
    bottomLeft: iNotification[];
    bottomRight: iNotification[];
    bottomCenter: iNotification[];
    center: iNotification[];
};
export declare function getTransition({ duration, timingFunction, delay }: iTransition, property: string): string;
export declare function parseNotification(options: iNotification, userDefinedTypes: iNotificationCustomType[], defaultNotificationWidth: number): iNotification;
