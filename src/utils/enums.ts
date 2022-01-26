export {
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