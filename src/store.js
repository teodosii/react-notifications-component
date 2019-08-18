import { parseNotification } from './helpers';
import { ERROR, NOTIFICATION_TYPE as NT } from './constants';
import {
  isNull,
  isString,
  isNumber,
  isBoolean,
  isArray
} from "src/utils";

function validateTransition(notification, transition) {
  const {
    TRANSITION_DURATION_NUMBER,
    TRANSITION_CUBICBEZIER_NUMBER,
    TRANSITION_DELAY_NUMBER
  } = ERROR;

  const { duration, timingFunction, delay } = notification[transition] || {};

  if (!isNull(duration) && !isNumber(duration)) {
    throw new Error(TRANSITION_DURATION_NUMBER.replace('transition', transition));
  }

  if (!isNull(timingFunction) && !isString(timingFunction)) {
    throw new Error(TRANSITION_CUBICBEZIER_NUMBER.replace('transition', transition));
  }

  if (!isNull(delay) && !isNumber(delay)) {
    throw new Error(TRANSITION_DELAY_NUMBER.replace('transition', transition));
  }
}

const validators = [
  // `title` validator
  function({ content, title }) {
    if (content) return;
    if (isNull(title)) return;
    if (typeof title !== "string") {
      throw new Error(ERROR.TITLE_STRING);
    }
  },

  // `message` validator
  function({ content, message }) {
    if (content) return;
    if (!message) {
      throw new Error(ERROR.MESSAGE_REQUIRED);
    }

    if (!isString(message)) {
      throw new Error(ERROR.MESSAGE_STRING);
    }
  },

  // `type` validator
  function({ content, type }, userDefinedTypes) {
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

  // `container` validator
  function({ container }) {
    if (isNull(container)) {
      throw new Error(ERROR.CONTAINER_REQUIRED);
    }

    if (!isString(container)) {
      throw new Error(ERROR.CONTAINER_STRING);
    }
  },

  // `insert` validator
  function ({ insert }) {
    if (isNull(insert)) return;
    if (!isString(insert)) {
      throw new Error(ERROR.INSERT_STRING);
    }
  },

  // `width` validator
  function({ width }) {
    if (isNull(width)) return;
    if (!isNumber(width)) {
      throw new Error(ERROR.WIDTH_NUMBER);
    }
  },

  // `userDefinedTypes` validator
  function({ type, content }, userDefinedTypes) {
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

  // `animationIn` validator
  function({ animationIn }) {
    if (isNull(animationIn)) return;
    if (!isArray(animationIn)) {
      throw new Error(ERROR.ANIMATION_IN);
    }
  },

  // `animationOut` validator
  function({ animationOut }) {
    if (isNull(animationOut)) return;
    if (!isArray(animationOut)) {
      throw new Error(ERROR.ANIMATION_OUT);
    }
  },

  // `dismiss` validator
  function({ dismiss }) {
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

function Store() {
  this.userDefinedTypes = null;
  this.add = () => {};
  this.addNotification = (notification) => {
    const { userDefinedTypes } = this;

    if (process.env.NODE_ENV === 'development') {
      const transitions = ['slidingEnter','slidingExit', 'touchSlidingBack', 'touchSlidingExit'];
      transitions.forEach((transition) => validateTransition(notification, transition));
      validators.forEach((validator) => validator(notification, userDefinedTypes));
    }

    return this.add(parseNotification(notification, userDefinedTypes));
  };
  this.removeNotification = () => {};
  this.register = ({ addNotification, removeNotification, userDefinedTypes }) => {
    this.add = addNotification;
    this.removeNotification = removeNotification;
    this.userDefinedTypes = userDefinedTypes;
  };

  return this;
}

export default new Store();