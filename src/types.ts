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
  NOTIFICATION_INSERTION,
  NOTIFICATION_TYPE,
  NOTIFICATION_REMOVAL_SOURCE
}

enum NOTIFICATION_CONTAINER {
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_CENTER = 'bottom-center',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  TOP_CENTER = 'top-center',
  CENTER = 'center',
  TOP_FULL = 'top-full',
  BOTTOM_FULL = 'bottom-full'
}

enum NOTIFICATION_INSERTION {
  TOP = 'top',
  BOTTOM = 'bottom'
}

enum NOTIFICATION_TYPE {
  SUCCESS = 'success',
  DANGER = 'danger',
  INFO = 'info',
  DEFAULT = 'default',
  WARNING = 'warning'
}

enum NOTIFICATION_REMOVAL_SOURCE {
  TIMEOUT = 'timeout',
  CLICK = 'click',
  TOUCH = 'touch',
  MANUAL = 'manual'
}

interface iContainerProps {
  isMobile?: boolean
  breakpoint?: number
  types?: iNotificationCustomType[]
  defaultNotificationWidth?: number
}

interface iContainerState {
  isMobile: boolean
  breakpoint: number
  notifications: iNotification[]
  windowWidth: number
}

interface iNotification {
  id?: string
  onRemoval?: (id: string, removalFlag: string) => void
  title?: NotificationTitleMessage
  message?: NotificationTitleMessage
  content?: NotificationContent
  type?: NOTIFICATION_TYPE
  container?: NOTIFICATION_CONTAINER
  insert?: NOTIFICATION_INSERTION
  dismiss?: iNotificationDismiss
  animationIn?: string[]
  animationOut?: string[]
  slidingEnter?: iTransition
  slidingExit?: iTransition
  touchRevert?: iTransition
  touchSlidingExit?: {
    fade: iTransition
    swipe: iTransition
  }
  userDefinedTypes?: iNotificationCustomType[]
  width?: number
  hasBeenRemoved?: boolean
}

type NotificationTitleMessage = string | React.ReactNode | React.FunctionComponent
type NotificationContent =
  | React.ComponentClass<any, any>
  | React.FunctionComponent<any>
  | React.ReactElement

interface iTransition {
  duration: number
  timingFunction: string
  delay: number
}

interface iTouchTransition {
  swipe: iTransition
  fade: iTransition
}

interface iNotificationDismiss {
  duration: number
  onScreen: boolean
  pauseOnHover: boolean
  waitForAnimation: boolean
  click: boolean
  touch: boolean
  showIcon: boolean
}

interface iNotificationCustomType {
  htmlClasses: string[]
  name: string
}

interface iNotificationProps {
  id: string
  notification: iNotification
  defaultNotificationWidth: number
  notificationsCount: number
  isMobile: boolean
  hasBeenRemoved: boolean
  toggleRemoval: (id: string, callback: () => void) => void
}

interface iNotificationState {
  parentStyle?: iNotificationParentStyle
  htmlClassList?: string[]
  animationPlayState?: string
  touchEnabled?: boolean
  onTransitionEnd?: (event: React.TransitionEvent<HTMLDivElement>) => void
  onAnimationEnd?: (event: React.AnimationEvent<HTMLDivElement>) => void
  startX?: number
  currentX?: number
}

interface iNotificationParentStyle {
  height?: string
  overflow?: string
  width?: string
  transition?: string
}

interface iStore {
  addNotification(notification: iNotification): string
  removeNotification(id: string): void
  register(param: iNotificationStoreParams): void
}

interface iNotificationStoreParams {
  addNotification: (notification: iNotification) => string
  removeNotification: (id: string) => void
  removeAllNotifications: () => void
  types: iNotificationCustomType[]
  defaultNotificationWidth: number
}
