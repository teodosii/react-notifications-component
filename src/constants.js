export const NOTIFICATION_BASE_CLASS = "notification-item";

export const CONTAINER = {
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_CENTER: "bottom-center",
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right",
  TOP_CENTER: "top-center",
};

export const INSERTION = {
  TOP: "top",
  BOTTOM: "bottom"
};

export const NOTIFICATION_TYPE = {
  SUCCESS: "success",
  DANGER: "danger",
  INFO: "info",
  DEFAULT: "default",
  WARNING: "warning"
};

export const NOTIFICATION_STAGE = {
  // used for both sliding and animation at the same time
  SLIDING_ANIMATION_EXIT: "SLIDING_ANIMATION_EXIT",
  // used for onTouchMove/onTouchEnd to slide and animate
  TOUCH_SLIDING_ANIMATION_EXIT: "TOUCH_SLIDING_ANIMATION_EXIT",
  // used by API call to remove notification
  MANUAL_REMOVAL: "REMOVAL"
};

export const REMOVAL = {
  TIMEOUT: 1,
  CLICK: 2,
  TOUCH: 3,
  MANUAL: 4
};

export const ERROR = {
  // dismiss icon option
  DISMISS_ICON_CLASS: "Validation error. className property of dismissIcon option is required",
  DISMISS_ICON_CONTENT: "Validation error. content property of dismissIcon option is required",
  DISMISS_ICON_STRING: "Validation error. className property of dismissIcon option must be a String",
  DISMISS_ICON_INVALID: "Validation error. content property of dismissIcon option must be a valid React element",

  // animations
  ANIMATION_IN: "Validation error. animationIn option must be an array",
  ANIMATION_OUT: "Validation error. animationOut option must be an array",

  // dismiss
  DISMISS_REQUIRED: "Validation error. duration property of dismiss option is required",
  DISMISS_NUMBER: "Validation error. duration property of dismiss option must be a Number",
  DISMISS_POSITIVE: "Validation error. duration property of dismiss option must be a positive Number",

  // title
  TITLE_STRING: "Validation error. title option must be a String.",

  // message
  MESSAGE_REQUIRED: "Validation error. message option is required",
  MESSAGE_STRING: "Validation error. message option must be a String",

  // type
  TYPE_REQUIRED: "Validation error. type option is required",
  TYPE_STRING: "Validation error. type option must be a String",
  TYPE_NOT_EXISTENT: "Validation error. type option not found",

  // container
  CONTAINER_REQUIRED: "Validation error. container option is required",
  CONTAINER_STRING: "Validation error. container option must be a String",

  // dismissable
  DISMISSABLE_CLICK_BOOL: "Validation error. click property of dismissable option must be a Boolean",
  DISMISSABLE_TOUCH_BOOL: "Validation error. touch property of dismissable option must be a Boolean",

  // width
  WIDTH_NUMBER: "Validation error. width option must be a Number",

  // insert
  INSERT_STRING: "Validation error. insert option must be a String",

  // transition
  TRANSITION_DURATION_NUMBER: "Validation error. duration property of transition option must be a Number",
  TRANSITION_CUBICBEZIER_NUMBER: "Validation error. timingFunction property of transition option must be a String",
  TRANSITION_DELAY_NUMBER: "Validation error. delay property of transition option must be a Number",

  // custom types
  TYPE_NOT_FOUND: "Validation error. custom type not found"
};
