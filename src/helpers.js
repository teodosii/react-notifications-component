import React from "react";
import {
  handleTouchSlidingAnimationExit,
  handleSlidingAnimationExit
} from "./stage-helpers";

import {
  NOTIFICATION_BASE_CLASS,
  CONTAINER,
  INSERTION,
  NOTIFICATION_TYPE,
  NOTIFICATION_STAGE
} from "./constants";

import {
  isNullOrUndefined,
  isString,
  isNumber,
  isBoolean,
  isArray
} from "./utils";

import ERROR from "./errors";

export function isBottomContainer(container) {
  return (
    container === CONTAINER.BOTTOM_LEFT ||
    container === CONTAINER.BOTTOM_RIGHT
  );
}

export function isTopContainer(container) {
  return (
    container === CONTAINER.TOP_LEFT ||
    container === CONTAINER.TOP_RIGHT
  );
}

export function shouldNotificationHaveSliding(notification) {
  return (
    // slide DOWN if container is top and insertion is at top
    (notification.insert === INSERTION.TOP && isTopContainer(notification.container)) ||
    // slide UP if container is bottom and insertion is at bottom
    (notification.insert === INSERTION.BOTTOM && isBottomContainer(notification.container))
  );
}

export function cssWidth(width) {
  return width ? `${width}px` : undefined;
}

function htmlClassesForExistingType(type) {
  switch (type.toLowerCase()) {
    case NOTIFICATION_TYPE.DEFAULT:
      return [NOTIFICATION_BASE_CLASS, "notification-default"];
    case NOTIFICATION_TYPE.SUCCESS:
      return [NOTIFICATION_BASE_CLASS, "notification-success"];
    case NOTIFICATION_TYPE.DANGER:
      return [NOTIFICATION_BASE_CLASS, "notification-danger"];
    case NOTIFICATION_TYPE.WARNING:
      return [NOTIFICATION_BASE_CLASS, "notification-warning"];
    case NOTIFICATION_TYPE.INFO:
      return [NOTIFICATION_BASE_CLASS, "notification-info"];
    default:
      throw new Error(`Type '${type}' is not valid nor user-defined`);
  }
}

export function getHtmlClassesForType(notification) {
  const {
    // option set by user
    type,
    // array value containing all custom types
    userDefinedTypes
  } = notification;

  if (notification.content) {
    // return only base class if type is not defined
    return [NOTIFICATION_BASE_CLASS];
  } else if (isNullOrUndefined(userDefinedTypes)) {
    // existing type
    return htmlClassesForExistingType(type);
  }

  // look for custom type if any defined
  const foundType = userDefinedTypes.find(q => q.name === type);

  if (!foundType) {
    // custom type not found, throw error
    throw new Error(ERROR.TYPE_NOT_FOUND);
  }

  // append base class to html classes
  return [NOTIFICATION_BASE_CLASS].concat(foundType.htmlClasses);
}

export function getNotificationsForMobileView(notifications) {
  const {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
  } = CONTAINER;

  const bottom = [];
  const top = [];

  notifications.forEach((notification) => {
    const container = notification.container.toLowerCase();
    switch (container) {
      case TOP_LEFT:
      case TOP_RIGHT:
        top.push(notification);
        break;
      case BOTTOM_LEFT:
      case BOTTOM_RIGHT:
        bottom.push(notification);
        break;
      default:
        // throw error just in case validation didn't work properly
        throw new Error(`Container ${notification.container} is not valid`);
    }
  });

  return { top, bottom };
}

export function getNotificationsForEachContainer(notifications) {
  const topLeft = [];
  const topRight = [];
  const bottomLeft = [];
  const bottomRight = [];

  notifications.forEach((notification) => {
    const {
      TOP_LEFT,
      TOP_RIGHT,
      BOTTOM_LEFT,
      BOTTOM_RIGHT
    } = CONTAINER;

    const container = notification.container.toLowerCase();
    switch (container) {
      case TOP_LEFT:
        topLeft.push(notification);
        break;
      case TOP_RIGHT:
        topRight.push(notification);
        break;
      case BOTTOM_LEFT:
        bottomLeft.push(notification);
        break;
      case BOTTOM_RIGHT:
        bottomRight.push(notification);
        break;
      default:
        // throw error just in case validation didn't work properly
        throw new Error(`Container ${notification.container} is not valid`);
    }
  });

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  };
}

export function getInitialSlidingState({ notification, isFirstNotification }) {
  // no sliding needed for first notification in container
  const hasSliding = shouldNotificationHaveSliding(notification) && !isFirstNotification;
  const state = {};

  // set default classes for animated element
  state.animatedElementClasses = getHtmlClassesForType(notification);
  state.rootElementStyle = {
    height: "0",
    marginBottom: 0,
    overflow: "hidden",
    width: cssWidth(notification.width)
  };

  if (hasSliding) {
    // hide content by toggling visibility while sliding
    state.animatedElementClasses.push("invisible");
  } else if (notification.animationIn && notification.animationIn.length > 0) {
    // add user defined notification classes if sliding will not occur
    notification.animationIn.forEach(item => state.animatedElementClasses.push(item));
  }

  state.hasSliding = hasSliding;
  return state;
}

export function handleStageTransition(notification, state) {
  let animatedElementClasses;
  let rootElementStyle;

  const {
    animatedElementClasses: stateAnimatedElementClasses,
    rootElementStyle: stateRootStyle,
    currentX,
    startX
  } = state;

  if (notification.stage === NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT) {
    return handleTouchSlidingAnimationExit(notification, currentX, startX);
  } else if (notification.stage === NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT) {
    return handleSlidingAnimationExit(notification);
  } else if (notification.resized) {
    // window got resized, do not apply animations
    rootElementStyle = stateRootStyle;
    animatedElementClasses = getHtmlClassesForType(notification);
  } else {
    // use values from state
    rootElementStyle = stateRootStyle;
    animatedElementClasses = stateAnimatedElementClasses;
  }

  return {
    rootElementStyle,
    animatedElementClasses
  };
}

export function getCubicBezierTransition(
  duration = 500,
  cubicBezier = "linear",
  delay = 0,
  property = "height"
) {
  return `${duration}ms ${property} ${cubicBezier} ${delay}ms`;
}

export function hasFullySwiped(diffX) {
  const swipeLength = Math.abs(diffX);
  const requiredSwipeLength = (40 / 100) * window.innerWidth;

  return swipeLength >= requiredSwipeLength;
}

export function getRootHeightStyle(notification, scrollHeight) {
  return {
    height: `${scrollHeight}px`,
    width: cssWidth(notification.width),
    transition: getCubicBezierTransition(
      notification.slidingExit.duration,
      notification.slidingExit.cubicBezier,
      notification.slidingExit.delay
    )
  };
}

export function getIconHtmlContent(notification, onClickHandler) {
  // use icon defined by user
  if (notification.dismissIcon) {
    return (
      <div
        className={notification.dismissIcon.className}
        onClick={onClickHandler}
      >
        {notification.icon}
      </div>
    );
  }

  // use standard icon
  return (
    <div
      className="notification-close"
      onClick={onClickHandler}
    >
      <span>&times;</span>
    </div>
  );
}

export function validateDismissIconOption(dismissIcon) {
  if (isNullOrUndefined(dismissIcon)) return;

  const { className, content } = dismissIcon;

  if (!className) {
    // className is required
    throw new Error(ERROR.DISMISS_ICON_CLASS);
  } else if (!isString(className)) {
    // must be an array value
    throw new Error(ERROR.DISMISS_ICON_STRING);
  } else if (!content) {
    // content is required
    throw new Error(ERROR.DISMISS_ICON_CONTENT);
  } else if (!React.isValidElement(content)) {
    // must be a valid react element
    throw new Error(ERROR.DISMISS_ICON_INVALID);
  }
}

export function validateAnimationIn(animationIn) {
  if (isNullOrUndefined(animationIn)) {
    return [];
  } if (!isArray(animationIn)) {
    // must be an array
    throw new Error(ERROR.ANIMATION_IN);
  }

  return animationIn;
}

export function validateAnimationOut(animationOut) {
  if (isNullOrUndefined(animationOut)) {
    return [];
  } else if (!isArray(animationOut)) {
    // must be an array
    throw new Error(ERROR.ANIMATION_OUT);
  }

  return animationOut;
}

export function validateTimeoutDismissOption(dismiss) {
  // skip if option is not defined
  if (isNullOrUndefined(dismiss)) return;

  if (isNullOrUndefined(dismiss.duration)) {
    throw new Error(ERROR.DISMISS_REQUIRED);
  } else if (!isNumber(dismiss.duration)) {
    // must be a number
    throw new Error(ERROR.DISMISS_NUMBER);
  } else if (dismiss.duration < 0) {
    // duration must be positive
    throw new Error(ERROR.DISMISS_POSITIVE);
  }
}

export function validateTransition(transition, defaults) {
  const { duration, cubicBezier, delay } = defaults;
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
  } else if (!isString(transitionOptions.cubicBezier)) {
    // throw if cubicBezier is not a String
    throw new Error(ERROR.TRANSITION_CUBICBEZIER_NUMBER);
  } else if (!isNumber(transitionOptions.delay)) {
    // throw if duration is NaN
    throw new Error(ERROR.TRANSITION_DELAY_NUMBER);
  }

  return transitionOptions;
}

export function validateTitle(notification) {
  const { content, title } = notification;

  // option not required if content is defined
  if (content) return;

  if (title === null || title === undefined) {
    // title is required
    throw new Error(ERROR.TITLE_REQUIRED);
  } else if (!isString(title)) {
    // title must be a String
    throw new Error(ERROR.TITLE_STRING);
  }
}

export function validateMessage(notification) {
  const { content, message } = notification;

  // option not required if content is defined
  if (content) return;

  if (message === null || message === undefined) {
    throw new Error(ERROR.MESSAGE_REQUIRED);
  } else if (!isString(message)) {
    throw new Error(ERROR.MESSAGE_STRING);
  }
}

export function validateType(notification, userDefinedTypes) {
  const { content, type } = notification;

  if (content) {
    // option not required if content is defined
    return undefined;
  } else if (isNullOrUndefined(type)) {
    // type is required
    throw new Error(ERROR.TYPE_REQUIRED);
  } else if (!isString(type)) {
    // type must be a String
    throw new Error(ERROR.TYPE_STRING);
  } else if (
    isNullOrUndefined(userDefinedTypes) &&
    type !== NOTIFICATION_TYPE.SUCCESS &&
    type !== NOTIFICATION_TYPE.DANGER &&
    type !== NOTIFICATION_TYPE.INFO &&
    type !== NOTIFICATION_TYPE.DEFAULT &&
    type !== NOTIFICATION_TYPE.WARNING
  ) {
    throw new Error(ERROR.TYPE_NOT_EXISTENT);
  }

  return type.toLowerCase();
}

export function validateContainer(container) {
  if (isNullOrUndefined(container)) {
    // container is required
    throw new Error(ERROR.CONTAINER_REQUIRED);
  } else if (!isString(container)) {
    // container must be a String
    throw new Error(ERROR.CONTAINER_STRING);
  }

  return container.toLowerCase();
}

export function validateDismissable(dismissable) {
  if (isNullOrUndefined(dismissable)) {
    return {
      // set dissmisable by click as default
      click: true,
      // set dismissable on swipe as default
      touch: true
    };
  }

  const option = dismissable;

  if (isNullOrUndefined(option.click)) {
    // set dissmisable by click as default
    option.click = true;
  }

  if (isNullOrUndefined(option.touch)) {
    // set dismissable on swipe as default
    option.touch = true;
  }

  if (!isBoolean(option.click)) {
    // must be boolean
    throw new Error(ERROR.DISMISSABLE_CLICK_BOOL);
  } else if (!isBoolean(option.touch)) {
    // must be boolean
    throw new Error(ERROR.DISMISSABLE_TOUCH_BOOL);
  }

  return option;
}

export function validateInsert(insert) {
  if (isNullOrUndefined(insert)) {
    // default to top if not defined
    return "top";
  } else if (!isString(insert)) {
    // must be a string value (top|bottom)
    throw new Error(ERROR.INSERT_STRING);
  }

  return insert;
}

export function validateWidth(width) {
  if (!isNumber(width)) {
    // width must be a valid Number
    throw new Error(ERROR.WIDTH_NUMBER);
  }

  return width;
}

export function validateUserDefinedTypes(notification, definedTypes) {
  const { content, type } = notification;

  // no need to validate type if content is defined
  if (content) return undefined;

  if (
    type === NOTIFICATION_TYPE.SUCCESS ||
    type === NOTIFICATION_TYPE.DANGER ||
    type === NOTIFICATION_TYPE.INFO ||
    type === NOTIFICATION_TYPE.DEFAULT ||
    type === NOTIFICATION_TYPE.WARNING ||
    isNullOrUndefined(definedTypes)
  ) return undefined;

  // search for custom type in array
  if (!definedTypes.find(p => p.name === type)) {
    // custom type not found, throw exception
    throw new Error(ERROR.TYPE_NOT_FOUND);
  }

  return definedTypes;
}

function getRandomId() {
  return Math.random();
}

export function getNotificationOptions(options, userDefinedTypes) {
  const notification = options;
  const {
    insert,
    container,
    dismissIcon,
    animationIn,
    animationOut,
    slidingEnter,
    slidingExit,
    touchSlidingBack,
    touchSlidingExit,
    dismissable,
    dismiss,
    width
  } = notification;

  // for now we'll use Math.random for id
  notification.id = getRandomId();

  // validate notification's title
  validateTitle(notification);

  // validate notification's body message
  validateMessage(notification);

  // validate notification's type
  notification.type = validateType(notification, userDefinedTypes);

  if (userDefinedTypes && !notification.content) {
    // validate user defined types if any
    notification.userDefinedTypes = validateUserDefinedTypes(notification, userDefinedTypes);
  }

  // validate notification's container
  notification.container = validateContainer(container);

  // set default insertion
  notification.insert = validateInsert(insert);

  // set default dismissable options
  notification.dismissable = validateDismissable(dismissable);

  // assert `dismissIcon` matches rules
  validateDismissIconOption(dismissIcon);

  // validate `animationIn` array
  notification.animationIn = validateAnimationIn(animationIn);

  // validate `animationOut` array
  notification.animationOut = validateAnimationOut(animationOut);

  if (!isNullOrUndefined(width)) {
    // set width option only if defined
    notification.width = validateWidth(width);
  }

  // defaults
  const slidingEnterDefaults = { duration: 600, cubicBezier: "linear", delay: 0 };
  const slidingExitDefaults = { duration: 600, cubicBezier: "linear", delay: 0 };
  const swipeBackDefaults = { duration: 600, cubicBezier: "ease-in", delay: 0 };
  const swipeExitDefaults = { duration: 600, cubicBezier: "ease-in", delay: 0 };
  const swipeCompleteDefaults = { duration: 300, cubicBezier: "ease-in", delay: 0 };

  // set defaults for sliding enter transition
  notification.slidingEnter = validateTransition(slidingEnter, slidingEnterDefaults);

  // set defaults for sliding exit transition
  notification.slidingExit = validateTransition(slidingExit, slidingExitDefaults);

  // set defaults for sliding back on touchEnd/touchCancel
  notification.touchSlidingBack = validateTransition(touchSlidingBack, swipeBackDefaults);

  // let it empty object if undefined
  notification.touchSlidingExit = notification.touchSlidingExit || {};

  // set defaults for swipe transition when swipe is complete
  notification.touchSlidingExit.swipe = validateTransition(
    touchSlidingExit.swipe || {},
    swipeExitDefaults
  );

  // set defaults for fade transition when swipe is complete
  notification.touchSlidingExit.fade = validateTransition(
    touchSlidingExit.fade || {},
    swipeCompleteDefaults
  );

  // assert `dismiss` matches rules
  validateTimeoutDismissOption(dismiss);

  return notification;
}
