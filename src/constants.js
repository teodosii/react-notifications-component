export const NOTIFICATION_BASE_CLASS = "notification-item";

export const CONTAINER = {
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right"
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
  REMOVAL: "REMOVAL"
};
