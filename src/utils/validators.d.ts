import { iNotification, iNotificationCustomType } from 'src/components/Notification';
export declare function validateTransition(notification: iNotification, transition: string): void;
export declare const validators: (({ content, type: _type }: iNotification, userDefinedTypes: iNotificationCustomType[]) => void)[];
