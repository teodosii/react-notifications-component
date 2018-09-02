import React from "react";
import {
  ERROR,
  NOTIFICATION_BASE_CLASS,
  CONTAINER,
  INSERTION,
  NOTIFICATION_TYPE,
  NOTIFICATION_STAGE
} from "src/constants";

import {
  validateDismissIconOption,
  validateAnimationIn,
  validateAnimationOut,
  validateTimeoutDismissOption,
  validateTransition,
  validateTitle,
  validateMessage,
  validateType,
  validateContainer,
  validateDismissable,
  validateInsert,
  validateWidth,
  validateUserDefinedTypes
} from "src/validators";

import {
  cssWidth,
  isNullOrUndefined
} from "src/utils";

export function isBottomContainer(container) {
  return (
    container === CONTAINER.BOTTOM_LEFT
    || container === CONTAINER.BOTTOM_RIGHT
  );
}

export function isTopContainer(container) {
  return (
    container === CONTAINER.TOP_LEFT
    || container === CONTAINER.TOP_RIGHT
  );
}

export function shouldNotificationHaveSliding(notification) {
  return (
    // slide DOWN if container is top and insertion is at top
    (notification.insert === INSERTION.TOP && isTopContainer(notification.container))
    // slide UP if container is bottom and insertion is at bottom
    || (notification.insert === INSERTION.BOTTOM && isBottomContainer(notification.container))
  );
}

export function htmlClassesForExistingType(type) {
  const lowerCaseType = type.toLowerCase();

  switch (lowerCaseType) {
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
      return [NOTIFICATION_BASE_CLASS];
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
  }

  if (!userDefinedTypes) {
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
    if (container === TOP_LEFT || container === TOP_RIGHT) {
      top.push(notification);
    } else if (container === BOTTOM_LEFT || container === BOTTOM_RIGHT) {
      bottom.push(notification);
    } else throw new Error(`Container ${notification.container} is not valid`);
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
    if (container === TOP_LEFT) {
      topLeft.push(notification);
    } else if (container === TOP_RIGHT) {
      topRight.push(notification);
    } else if (container === BOTTOM_LEFT) {
      bottomLeft.push(notification);
    } else if (container === BOTTOM_RIGHT) {
      bottomRight.push(notification);
    } else throw new Error(`Container ${notification.container} is not valid`);
  });

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
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

export function slidingExitTransition(notification) {
  return getCubicBezierTransition(
    notification.slidingExit.duration,
    notification.slidingExit.cubicBezier,
    notification.slidingExit.delay,
    "all"
  );
}

export function touchSwipeTransition(notification) {
  const { swipe } = notification.touchSlidingExit;

  return getCubicBezierTransition(
    swipe.duration,
    swipe.cubicBezier,
    swipe.delay,
    "left"
  );
}

export function touchFadeTransition(notification) {
  const { fade } = notification.touchSlidingExit;

  return getCubicBezierTransition(
    fade.duration,
    fade.cubicBezier,
    fade.delay,
    "opacity"
  );
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
    state.animatedElementClasses.push("notification-invisible");
  } else if (notification.animationIn && notification.animationIn.length > 0) {
    // add user defined notification classes if sliding will not occur
    notification.animationIn.forEach(item => state.animatedElementClasses.push(item));
  }

  state.hasSliding = hasSliding;
  return state;
}

export function getChildStyleForTouchTransitionExit(notification, startX, currentX) {
  const width = window.innerWidth * 2;
  const touchSwipe = touchSwipeTransition(notification);
  const touchFade = touchFadeTransition(notification);

  return {
    opacity: 0,
    position: "relative",
    transition: `${touchSwipe}, ${touchFade}`,

    // for currentX > startX
    // we slide to the right limit
    // otherwise we slide to the left limit
    left: `${currentX - startX >= 0 ? width : -width}px`
  };
}

export function handleTouchSlidingAnimationExit(notification, currentX, startX) {
  // set current html classes
  const animatedElementClasses = getHtmlClassesForType(notification);
  // set opacity and left to pull-out notification
  const childElementStyle = getChildStyleForTouchTransitionExit(notification, startX, currentX);
  // sliding out transition
  const slidingTransition = slidingExitTransition(notification);

  return {
    childElementStyle,
    animatedElementClasses,
    // slide to height 0
    rootElementStyle: {
      height: 0,
      marginBottom: 0,
      transition: slidingTransition,
      width: cssWidth(notification.width)
    },
  };
}

export function handleSlidingAnimationExit(notification) {
  const { animationOut } = notification;
  const animatedElementClasses = getHtmlClassesForType(notification);

  if (animationOut) {
    // add CSS classes if any defined
    animationOut.forEach(item => animatedElementClasses.push(item));
  }

  return {
    // slide element to height 0
    rootElementStyle: {
      height: 0,
      marginBottom: 0,
      transition: slidingExitTransition(notification),
      width: cssWidth(notification.width)
    },
    animatedElementClasses
  };
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
  }

  if (notification.stage === NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT) {
    return handleSlidingAnimationExit(notification);
  }

  if (notification.resized) {
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
        {notification.dismissIcon.content}
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

export function getRandomId() {
  return Math.random().toString(36).substr(2, 9);
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
  notification.touchSlidingExit = touchSlidingExit || {};

  // set defaults for swipe transition when swipe is complete
  notification.touchSlidingExit.swipe = validateTransition(
    notification.touchSlidingExit.swipe || {},
    swipeExitDefaults
  );

  // set defaults for fade transition when swipe is complete
  notification.touchSlidingExit.fade = validateTransition(
    notification.touchSlidingExit.fade || {},
    swipeCompleteDefaults
  );

  // assert `dismiss` matches rules
  validateTimeoutDismissOption(dismiss);

  return notification;
}
