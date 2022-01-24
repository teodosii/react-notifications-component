import { Container } from 'src/components/Container'
import Store from 'src/store'
export default Container

import {
  iContainerProps,
  iContainerState,
  iNotification,
  NotificationTitleMessage,
  NotificationContent,
  iTransition,
  iTouchTransition,
  iNotificationDismiss,
  iNotificationCustomType,
  iNotificationProps,
  iNotificationState,
  iNotificationParentStyle,
  iStore,
  iNotificationStoreParams,
  NOTIFICATION_CONTAINER,
  NOTIFICATION_TYPE,
  NOTIFICATION_INSERTION,
  NOTIFICATION_REMOVAL_SOURCE
} from './types'

export { Store as store } // otherwise it's breaking change
export { Container as ReactNotifications }

export {
  iContainerProps,
  iContainerState,
  iNotification,
  NotificationTitleMessage,
  NotificationContent,
  iTransition,
  iTouchTransition,
  iNotificationDismiss,
  iNotificationCustomType,
  iNotificationProps,
  iNotificationState,
  iNotificationParentStyle,
  iStore,
  iNotificationStoreParams,
  NOTIFICATION_CONTAINER,
  NOTIFICATION_TYPE,
  NOTIFICATION_INSERTION,
  NOTIFICATION_REMOVAL_SOURCE
}
