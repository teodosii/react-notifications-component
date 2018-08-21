import React from "react";
import {
  ERROR,
  NOTIFICATION_TYPE
} from "src/constants";
import {
  isNullOrUndefined,
  isString,
  isNumber,
  isBoolean,
  isArray
} from "src/utils";

export function validateDismissIconOption(dismissIcon) {
  // skip validation for undefined option
  if (isNullOrUndefined(dismissIcon)) return;

  const {
    className: iconClassName,
    content: iconContent
  } = dismissIcon;

  if (!iconClassName) {
    // className is required
    throw new Error(ERROR.DISMISS_ICON_CLASS);
  }

  if (!isString(iconClassName)) {
    // icon's `className` must be a String
    throw new Error(ERROR.DISMISS_ICON_STRING);
  }

  if (!iconContent) {
    // icon's content is required
    throw new Error(ERROR.DISMISS_ICON_CONTENT);
  }

  if (!React.isValidElement(iconContent)) {
    // icon's content must be a valid react element
    throw new Error(ERROR.DISMISS_ICON_INVALID);
  }
}

export function validateAnimationIn(animationIn) {
  // return empty array instead of undefined
  if (isNullOrUndefined(animationIn)) return [];

  if (!isArray(animationIn)) {
    // option must be an Array
    throw new Error(ERROR.ANIMATION_IN);
  }

  return animationIn;
}

export function validateAnimationOut(animationOut) {
  // return empty array instead of undefined
  if (isNullOrUndefined(animationOut)) return [];

  if (!isArray(animationOut)) {
    // option must be an Array
    throw new Error(ERROR.ANIMATION_OUT);
  }

  return animationOut;
}

export function validateTimeoutDismissOption(dismiss) {
  // skip validation for undefined option
  if (!dismiss) return;

  if (isNullOrUndefined(dismiss.duration)) {
    // duration is required
    throw new Error(ERROR.DISMISS_REQUIRED);
  }

  if (!isNumber(dismiss.duration)) {
    // duration must be a Number
    throw new Error(ERROR.DISMISS_NUMBER);
  }

  if (dismiss.duration < 0) {
    // duration must be positive
    throw new Error(ERROR.DISMISS_POSITIVE);
  }
}

export function validateTransition(transition, defaults) {
  const {
    duration,
    cubicBezier,
    delay
  } = defaults;

  const transitionOptions = transition || {};

  if (isNullOrUndefined(transitionOptions.duration)) {
    // set default duration
    transitionOptions.duration = duration;
  }

  if (isNullOrUndefined(transitionOptions.cubicBezier)) {
    // set default timing function
    transitionOptions.cubicBezier = cubicBezier;
  }

  if (isNullOrUndefined(transitionOptions.delay)) {
    // set default delay
    transitionOptions.delay = delay;
  }

  if (!isNumber(transitionOptions.duration)) {
    // throw if duration is NaN
    throw new Error(ERROR.TRANSITION_DURATION_NUMBER);
  }

  if (!isString(transitionOptions.cubicBezier)) {
    // throw if cubicBezier is not a String
    throw new Error(ERROR.TRANSITION_CUBICBEZIER_NUMBER);
  }

  if (!isNumber(transitionOptions.delay)) {
    // throw if delay is NaN
    throw new Error(ERROR.TRANSITION_DELAY_NUMBER);
  }

  return transitionOptions;
}

export function validateTitle(notification) {
  const {
    content,
    title
  } = notification;

  // title is not required
  if (content || isNullOrUndefined(title)) return;

  if (!isString(title)) {
    // title must be a String if defined
    throw new Error(ERROR.TITLE_STRING);
  }
}

export function validateMessage(notification) {
  const {
    content,
    message
  } = notification;

  // message not required
  // if content is supplied
  if (content) return;

  if (!message) {
    // message is required
    throw new Error(ERROR.MESSAGE_REQUIRED);
  }

  if (!isString(message)) {
    // message must be a String
    throw new Error(ERROR.MESSAGE_STRING);
  }
}

export function validateType(notification, userDefinedTypes) {
  const {
    content,
    type
  } = notification;

  // skip type validation
  if (content) return undefined;

  if (!type) {
    // type is required
    throw new Error(ERROR.TYPE_REQUIRED);
  }

  if (!isString(type)) {
    // type must be a String
    throw new Error(ERROR.TYPE_STRING);
  }

  if (
    !userDefinedTypes
    && type !== NOTIFICATION_TYPE.SUCCESS
    && type !== NOTIFICATION_TYPE.DANGER
    && type !== NOTIFICATION_TYPE.INFO
    && type !== NOTIFICATION_TYPE.DEFAULT
    && type !== NOTIFICATION_TYPE.WARNING
  ) {
    // throw error if missing type
    throw new Error(ERROR.TYPE_NOT_EXISTENT);
  }

  return type.toLowerCase();
}

export function validateContainer(container) {
  if (!container) {
    // container is required
    throw new Error(ERROR.CONTAINER_REQUIRED);
  }

  if (!isString(container)) {
    // container must be a String
    throw new Error(ERROR.CONTAINER_STRING);
  }

  return container.toLowerCase();
}

export function validateDismissable(dismissable) {
  const option = dismissable;

  if (!option) {
    // return default values if option is undefined
    return { click: true, touch: true };
  }

  if (isNullOrUndefined(option.click)) {
    // set default value
    option.click = true;
  }

  if (isNullOrUndefined(option.touch)) {
    // set default value
    option.touch = true;
  }

  if (!isBoolean(option.click)) {
    // option must be Boolean
    throw new Error(ERROR.DISMISSABLE_CLICK_BOOL);
  }

  if (!isBoolean(option.touch)) {
    // option must be Boolean
    throw new Error(ERROR.DISMISSABLE_TOUCH_BOOL);
  }

  return option;
}

export function validateInsert(insert) {
  // set default insertion
  if (!insert) return "top";

  if (!isString(insert)) {
    // must be a String value
    throw new Error(ERROR.INSERT_STRING);
  }

  return insert.toLowerCase();
}

export function validateWidth(width) {
  // width is not required
  if (isNullOrUndefined(width)) return 0;

  if (!isNumber(width)) {
    // width must be a valid Number
    throw new Error(ERROR.WIDTH_NUMBER);
  }

  return width;
}

export function validateUserDefinedTypes(notification, definedTypes) {
  const { type } = notification;

  // skip validation in this case
  if (notification.content) return undefined;

  if (
    type === NOTIFICATION_TYPE.SUCCESS
    || type === NOTIFICATION_TYPE.DANGER
    || type === NOTIFICATION_TYPE.INFO
    || type === NOTIFICATION_TYPE.DEFAULT
    || type === NOTIFICATION_TYPE.WARNING
    || !definedTypes
  ) {
    return undefined;
  }

  // search for custom type in array
  if (!definedTypes.find(p => p.name === type)) {
    // custom type not found, throw exception
    throw new Error(ERROR.TYPE_NOT_FOUND);
  }

  return definedTypes;
}
