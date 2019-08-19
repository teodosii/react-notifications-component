import { ERROR, NOTIFICATION_TYPE as NT } from './constants';
import {
  isNull,
  isString,
  isNumber,
  isBoolean,
  isArray
} from 'src/utils';

export function validateTransition(notification, transition) {
  const {
    TRANSITION_DURATION_NUMBER,
    TRANSITION_TIMING_FUNCTION,
    TRANSITION_DELAY_NUMBER
  } = ERROR;

  const { duration, timingFunction, delay } = notification[transition] || {};

  if (!isNull(duration) && !isNumber(duration)) {
    throw new Error(TRANSITION_DURATION_NUMBER.replace('transition', transition));
  }

  if (!isNull(timingFunction) && !isString(timingFunction)) {
    throw new Error(TRANSITION_TIMING_FUNCTION.replace('transition', transition));
  }

  if (!isNull(delay) && !isNumber(delay)) {
    throw new Error(TRANSITION_DELAY_NUMBER.replace('transition', transition));
  }
}

export const validators = [
  function title({ content, title }) {
    if (content) return;
    if (isNull(title)) return;
    if (typeof title !== 'string') {
      throw new Error(ERROR.TITLE_STRING);
    }
  },

  function message({ content, message }) {
    if (content) return;

    if (!message) {
      throw new Error(ERROR.MESSAGE_REQUIRED);
    }

    if (!isString(message)) {
      throw new Error(ERROR.MESSAGE_STRING);
    }
  },

  function type({ content, type }, userDefinedTypes) {
    if (content) return;

    if (!type) {
      throw new Error(ERROR.TYPE_REQUIRED);
    }

    if (!isString(type)) {
      throw new Error(ERROR.TYPE_STRING);
    }

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

  function container({ container }) {
    if (isNull(container)) {
      throw new Error(ERROR.CONTAINER_REQUIRED);
    }

    if (!isString(container)) {
      throw new Error(ERROR.CONTAINER_STRING);
    }
  },

  function insert({ insert }) {
    if (isNull(insert)) return;
    if (!isString(insert)) {
      throw new Error(ERROR.INSERT_STRING);
    }
  },

  function width({ width }) {
    if (isNull(width)) return;
    if (!isNumber(width)) {
      throw new Error(ERROR.WIDTH_NUMBER);
    }
  },

  function userDefinedTypes({ type, content }, userDefinedTypes) {
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

  function animationIn({ animationIn }) {
    if (isNull(animationIn)) return;
    if (!isArray(animationIn)) {
      throw new Error(ERROR.ANIMATION_IN);
    }
  },

  function animationOut({ animationOut }) {
    if (isNull(animationOut)) return;
    if (!isArray(animationOut)) {
      throw new Error(ERROR.ANIMATION_OUT);
    }
  },

  function dismiss({ dismiss }) {
    if (!dismiss) return;

    const {
      DISMISS_NUMBER,
      DISMISS_REQUIRED,
      DISMISS_POSITIVE,
      DISMISS_CLICK_BOOL,
      DISMISS_TOUCH_BOOL,
      DISMISS_TOUCH_SLIDING,
      DISMISS_WAIT
    } = ERROR;

    const { duration, click, touch, waitForAnimation: wait, touchSliding } = dismiss;
    if (isNull(duration)) {
      throw new Error(DISMISS_REQUIRED);
    }

    if (!isNumber(duration)) {
      throw new Error(DISMISS_NUMBER);
    }

    if (duration < 0) {
      throw new Error(DISMISS_POSITIVE);
    }

    if (!isNull(click) && !isBoolean(click)) {
      throw new Error(DISMISS_CLICK_BOOL);
    }

    if (!isNull(touch) && !isBoolean(touch)) {
      throw new Error(DISMISS_TOUCH_BOOL);
    }

    if (!isNull(wait) && !isBoolean(wait)) {
      throw new Error(DISMISS_WAIT);
    }

    if (!isNull(touchSliding) && !isBoolean(touchSliding)) {
      throw new Error(DISMISS_TOUCH_SLIDING);
    }
  }
];