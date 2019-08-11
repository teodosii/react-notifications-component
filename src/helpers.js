import {
  ERROR,
  NOTIFICATION_BASE_CLASS,
  CONTAINER,
  INSERTION,
  NOTIFICATION_TYPE as NT,
  NOTIFICATION_STAGE
} from "src/constants";
import {
  cssWidth,
  isNullOrUndefined,
  getRandomId
} from "src/utils";

export function isBottomContainer(container) {
  return (
    container === CONTAINER.BOTTOM_LEFT
    || container === CONTAINER.BOTTOM_RIGHT
    || container === CONTAINER.BOTTOM_CENTER
  );
}

export function isTopContainer(container) {
  return (
    container === CONTAINER.TOP_LEFT
    || container === CONTAINER.TOP_RIGHT
    || container === CONTAINER.TOP_CENTER
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
    case NT.DEFAULT:
      return [NOTIFICATION_BASE_CLASS, "notification-default"];
    case NT.SUCCESS:
      return [NOTIFICATION_BASE_CLASS, "notification-success"];
    case NT.DANGER:
      return [NOTIFICATION_BASE_CLASS, "notification-danger"];
    case NT.WARNING:
      return [NOTIFICATION_BASE_CLASS, "notification-warning"];
    case NT.INFO:
      return [NOTIFICATION_BASE_CLASS, "notification-info"];
    default:
      return [NOTIFICATION_BASE_CLASS];
  }
}

export function getHtmlClassesForType({ type, userDefinedTypes, content }) {
  if (content) {
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
  const bottom = [];
  const top = [];

  notifications.forEach((notification) => {
    const container = notification.container.toLowerCase();
    if (isTopContainer(container)) {
      top.push(notification);
    } else if (isBottomContainer(container)) {
      bottom.push(notification);
    } else throw new Error(`Container ${notification.container} is not valid`);
  });

  return { top, bottom };
}

export function getNotificationsForEachContainer(notifications) {
  const topLeft = [];
  const topRight = [];
  const topCenter = [];
  const bottomLeft = [];
  const bottomRight = [];
  const bottomCenter = [];

  notifications.forEach((notification) => {
    const container = notification.container.toLowerCase();
    if (container === CONTAINER.TOP_LEFT) {
      topLeft.push(notification);
    } else if (container === CONTAINER.TOP_RIGHT) {
      topRight.push(notification);
    } else if (container === CONTAINER.TOP_CENTER) {
      topCenter.push(notification);
    } else if (container === CONTAINER.BOTTOM_LEFT) {
      bottomLeft.push(notification);
    } else if (container === CONTAINER.BOTTOM_RIGHT) {
      bottomRight.push(notification);
    } else if (container === CONTAINER.BOTTOM_CENTER) {
      bottomCenter.push(notification);
    } else {
      throw new Error(`Container ${notification.container} is not valid`);
    }
  });

  return {
    topLeft,
    topRight,
    topCenter,
    bottomLeft,
    bottomRight,
    bottomCenter
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
    TOUCH_SLIDING_ANIMATION_EXIT,
    SLIDING_ANIMATION_EXIT
  } = NOTIFICATION_STAGE;

  const {
    animatedElementClasses: stateAnimatedElementClasses,
    rootElementStyle: stateRootStyle,
    currentX,
    startX
  } = state;

  if (notification.stage === TOUCH_SLIDING_ANIMATION_EXIT) {
    return handleTouchSlidingAnimationExit(notification, currentX, startX);
  }

  if (notification.stage === SLIDING_ANIMATION_EXIT) {
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

function defaultAnimationIn(animationIn) {
  return animationIn || [];
}

function defaultAnimationOut(animationOut) {
  return animationOut || [];
}

function defaultTransition(transition, defaults) {
  const { duration, cubicBezier, delay } = defaults;
  const transitionOptions = transition || {};

  if (isNullOrUndefined(transitionOptions.duration)) {
    transitionOptions.duration = duration;
  }

  if (isNullOrUndefined(transitionOptions.cubicBezier)) {
    transitionOptions.cubicBezier = cubicBezier;
  }

  if (isNullOrUndefined(transitionOptions.delay)) {
    transitionOptions.delay = delay;
  }

  return transitionOptions;
}

function defaultType({ content, type }) {
  if (content) return undefined;
  return type.toLowerCase();
}

function defaultContainer(container) {
  return container.toLowerCase();
}

function defaultDismissable(dismissable) {
  const option = dismissable;

  if (!option) {
    return {
      click: true,
      touch: true
    };
  }

  if (isNullOrUndefined(option.click)) {
    option.click = true;
  }

  if (isNullOrUndefined(option.touch)) {
    option.touch = true;
  }

  return option;
}

function defaultInsert(insert) {
  if (!insert) return "top";
  return insert.toLowerCase();
}

function defaultWidth(width) {
  if (isNullOrUndefined(width)) return 0;
  return width;
}

function defaultUserDefinedTypes({ content, type }, definedTypes) {
  if (content) return undefined;

  if (
    type === NT.SUCCESS
    || type === NT.DANGER
    || type === NT.INFO
    || type === NT.DEFAULT
    || type === NT.WARNING
    || !definedTypes
  ) return undefined;

  return definedTypes;
}

export function parseNotification(options, userDefinedTypes) {
  const notification = options;
  const {
    insert,
    container,
    animationIn,
    animationOut,
    slidingEnter,
    slidingExit,
    touchSlidingBack,
    touchSlidingExit,
    dismissable,
    width,
    id
  } = notification;

  notification.id = id || getRandomId();
  notification.type = defaultType(notification, userDefinedTypes);

  if (userDefinedTypes && !notification.content) {
    notification.userDefinedTypes = defaultUserDefinedTypes(notification, userDefinedTypes);
  }

  notification.container = defaultContainer(container);
  notification.insert = defaultInsert(insert);
  notification.dismissable = defaultDismissable(dismissable);
  notification.animationIn = defaultAnimationIn(animationIn);
  notification.animationOut = defaultAnimationOut(animationOut);

  if (!isNullOrUndefined(width)) {
    notification.width = defaultWidth(width);
  }

  const slidingEnterDefaults = { duration: 600, cubicBezier: "linear", delay: 0 };
  const slidingExitDefaults = { duration: 600, cubicBezier: "linear", delay: 0 };
  const swipeBackDefaults = { duration: 600, cubicBezier: "ease-in", delay: 0 };
  const swipeExitDefaults = { duration: 600, cubicBezier: "ease-in", delay: 0 };
  const swipeCompleteDefaults = { duration: 300, cubicBezier: "ease-in", delay: 0 };
  notification.slidingEnter = defaultTransition(slidingEnter, slidingEnterDefaults);
  notification.slidingExit = defaultTransition(slidingExit, slidingExitDefaults);
  notification.touchSlidingBack = defaultTransition(touchSlidingBack, swipeBackDefaults);
  notification.touchSlidingExit = touchSlidingExit || {};
  notification.touchSlidingExit.swipe = defaultTransition(
    notification.touchSlidingExit.swipe || {},
    swipeExitDefaults
  );
  notification.touchSlidingExit.fade = defaultTransition(
    notification.touchSlidingExit.fade || {},
    swipeCompleteDefaults
  );

  return notification;
}
