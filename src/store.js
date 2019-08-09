import React from 'react';
import { ERROR, NOTIFICATION_TYPE as NT } from './constants';
import {
  isNullOrUndefined,
  isString,
  isNumber,
  isBoolean,
  isArray
} from "src/utils";

function validateTransition(props, propName) {
  const { duration, cubicBezier, delay } = props[propName] || {};

  if (!isNullOrUndefined(duration) && !isNumber(duration)) {
    throw new Error(ERROR.TRANSITION_DURATION_NUMBER);
  }

  if (!isNullOrUndefined(cubicBezier) && !isString(cubicBezier)) {
    throw new Error(ERROR.TRANSITION_CUBICBEZIER_NUMBER);
  }

  if (!isNullOrUndefined(delay) && !isNumber(delay)) {
    throw new Error(ERROR.TRANSITION_DELAY_NUMBER);
  }
}

const validators = [
  function({ content, title }) {
    if (content) return;
    if (isNullOrUndefined(title)) return;
    if (typeof title !== "string") {
      throw new Error(ERROR.TITLE_STRING);
    }
  },

  function({ content, message }) {
    if (content) return;
    if (!message) throw new Error(ERROR.MESSAGE_REQUIRED);
    if (!isString(message)) throw new Error(ERROR.MESSAGE_STRING);
  },

  function({ content, type, userDefinedTypes }) {
    if (content) return;
    if (!type) throw new Error(ERROR.TYPE_REQUIRED);
    if (!isString(type)) throw new Error(ERROR.TYPE_STRING);

    if (
      !userDefinedTypes
      && type !== NT.SUCCESS
      && type !== NT.DANGER
      && type !== NT.INFO
      && type !== NT.DEFAULT
      && type !== NT.WARNING
    ) {
      throw new Error(ERROR.TYPE_NOT_EXISTENT);
    }
  },

  function({ container }) {
    if (!container) throw new Error(ERROR.CONTAINER_REQUIRED);
    if (!isString(container)) throw new Error(ERROR.CONTAINER_STRING);
  },

  function({ dismissable }) {
    if (!dismissable) return;
    const { click, touch } = dismissable;
    const { DISMISSABLE_CLICK_BOOL, DISMISSABLE_TOUCH_BOOL } = ERROR;
    if (!isNullOrUndefined(click) && !isBoolean(click)) throw new Error(DISMISSABLE_CLICK_BOOL);
    if (!isNullOrUndefined(touch) && !isBoolean(touch)) throw new Error(DISMISSABLE_TOUCH_BOOL);
  },

  function ({ insert }) {
    if (!insert) return;
    if (!isString(insert)) throw new Error(ERROR.INSERT_STRING);
  },

  function({ width }) {
    if (isNullOrUndefined(width)) return
    if (!isNumber(width)) throw new Error(ERROR.WIDTH_NUMBER);
  },

  function({ dismissIcon }) {
    if (isNullOrUndefined(dismissIcon)) return;

    const {
      DISMISS_ICON_CLASS,
      DISMISS_ICON_STRING,
      DISMISS_ICON_CONTENT,
      DISMISS_ICON_INVALID
    } = ERROR;

    const { className: iconClassName, content: iconContent } = dismissIcon;
    if (!iconClassName) throw new Error(DISMISS_ICON_CLASS);
    if (!isString(iconClassName)) throw new Error(DISMISS_ICON_STRING);
    if (!iconContent) throw new Error(DISMISS_ICON_CONTENT);
    if (!React.isValidElement(iconContent)) throw new Error(DISMISS_ICON_INVALID);
  },

  function({ type, content, userDefinedTypes }) {
    if (content) return;

    if (
      type === NT.SUCCESS
      || type === NT.DANGER
      || type === NT.INFO
      || type === NT.DEFAULT
      || type === NT.WARNING
      || !userDefinedTypes
    ) return;

    if (!userDefinedTypes.find(p => p.name === type)) {
      throw new Error(ERROR.TYPE_NOT_FOUND);
    }
  },

  function({ animationIn }) {
    if (isNullOrUndefined(animationIn)) return;
    if (!isArray(animationIn)) throw new Error(ERROR.ANIMATION_IN);
  },

  function({ animationOut }) {
    if (isNullOrUndefined(animationOut)) return;
    if (!isArray(animationOut)) throw new Error(ERROR.ANIMATION_OUT);
  },

  function({ dismiss }) {
    const {
      DISMISS_NUMBER,
      DISMISS_REQUIRED,
      DISMISS_POSITIVE,
    } = ERROR;

    if (!dismiss) return;

    const { duration } = dismiss;
    if (isNullOrUndefined(duration)) throw new Error(DISMISS_REQUIRED);
    if (!isNumber(duration)) throw new Error(DISMISS_NUMBER);
    if (duration < 0) throw new Error(DISMISS_POSITIVE);
  }
];

function Store() {
  this.isRegistered = false;
  this.add = () => {};
  this.addNotification = (notification) => {
    if (process.env.NODE_ENV === 'development') {
      const transitions = ['slidingEnter','slidingExit', 'touchSlidingBack', 'touchSlidingExit'];
      transitions.forEach((transition) => validateTransition(transition));
      validators.forEach((validator) => validator(notification));
    }

    this.add(notification);
  };
  this.removeNotification = () => {};
  this.register = ({ addNotification, removeNotification }) => {
    this.add = addNotification;
    this.removeNotification = removeNotification;
  };

  return this;
}

export default new Store();