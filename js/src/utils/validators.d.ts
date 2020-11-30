import { iNotification, iNotificationCustomType } from 'src/types/Notification';
export declare function validateTransition(notification: iNotification, transition: string): void;
export declare const validators: (({ content, type: _type }: iNotification, userDefinedTypes: iNotificationCustomType[]) => void)[];
