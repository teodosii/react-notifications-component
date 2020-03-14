export const NOTIFICATION_BASE_CLASS = 'notification-item';

export const CONTAINER = {
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_CENTER: 'bottom-center',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  TOP_CENTER: 'top-center',
  CENTER: 'center'
};

export const INSERTION = {
  TOP: 'top',
  BOTTOM: 'bottom'
};

export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  DANGER: 'danger',
  INFO: 'info',
  DEFAULT: 'default',
  WARNING: 'warning'
};

export const REMOVAL = {
  TIMEOUT: 'timeout',
  CLICK: 'click',
  TOUCH: 'touch',
  MANUAL: 'manual'
};

export const ERROR = {
  ANIMATION_IN: 'Validation error. `animationIn` option must be an array',
  ANIMATION_OUT: 'Validation error. `animationOut` option must be an array',

  DISMISS_REQUIRED: 'Validation error. `duration` property of `dismiss` option is required',
  DISMISS_NUMBER: 'Validation error. `duration` property of `dismiss` option must be a Number',
  DISMISS_POSITIVE:
    'Validation error. `duration` property of `dismiss` option must be a positive Number',
  DISMISS_CLICK_BOOL: 'Validation error. `click` property of `dismiss` option must be a Boolean',
  DISMISS_TOUCH_BOOL: 'Validation error. `touch` property of `dismiss` option must be a Boolean',
  DISMISS_WAIT:
    'Validation error. `waitForAnimation` property of `dismiss` option must be a Boolean',
  DISMISS_PAUSE_BOOL:
    'Validation error. `pauseOnHover` property of `dismiss` option must be a Boolean',
  DISMISS_ONSCREEN_BOOL:
    'Validation error. `onScreen` property of `dismiss` option must be a Boolean',
  DISMISS_ICON: 'Validation error. `showIcon` property of `dismiss` option must be a Boolean',

  TITLE_STRING: 'Validation error. `title` option must be a String',
  TITLE_ELEMENT: 'Validation error. `title` option must be a valid React element/function',

  MESSAGE_REQUIRED: 'Validation error. `message` option is required',
  MESSAGE_STRING: 'Validation error. `message` option must be a String',
  MESSAGE_ELEMENT: 'Validation error. `message` option must be a valid React element/function',

  TYPE_REQUIRED: 'Validation error. `type` option is required',
  TYPE_STRING: 'Validation error. `type` option must be a String',
  TYPE_NOT_EXISTENT: 'Validation error. `type` option not found',

  CONTAINER_REQUIRED: 'Validation error. `container` option is required',
  CONTAINER_STRING: 'Validation error. `container` option must be a String',
  CONTENT_INVALID:
    'Validation error. `content` option must be a valid React component/function/element',
  
  WIDTH_NUMBER: 'Validation error. `width` option must be a Number',
  INSERT_STRING: 'Validation error. `insert` option must be a String',

  TRANSITION_DURATION_NUMBER:
    'Validation error. `duration` property of `transition` option must be a Number',
  TRANSITION_TIMING_FUNCTION:
    'Validation error. `timingFunction` property of `transition` option must be a String',
  TRANSITION_DELAY_NUMBER:
    'Validation error. `delay` property of `transition` option must be a Number',
  
  TYPE_NOT_FOUND: 'Validation error. Custom type not found',
  REMOVAL_FUNC: 'Validation error. `onRemoval` must be a function'
};
