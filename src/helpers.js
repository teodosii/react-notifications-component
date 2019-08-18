import {
  CONTAINER,
  INSERTION,
  NOTIFICATION_BASE_CLASS,
  NOTIFICATION_TYPE as NT,
} from "src/constants";
import { isNull, getRandomId } from "src/utils";

export function isBottomContainer(container) {
  return container === CONTAINER.BOTTOM_LEFT
    || container === CONTAINER.BOTTOM_RIGHT
    || container === CONTAINER.BOTTOM_CENTER;
}

export function isTopContainer(container) {
  return container === CONTAINER.TOP_LEFT
    || container === CONTAINER.TOP_RIGHT
    || container === CONTAINER.TOP_CENTER;
}

export function hasFullySwiped(diffX) {
  const swipeLength = Math.abs(diffX);
  const requiredSwipeLength = (40 / 100) * window.innerWidth;

  return swipeLength >= requiredSwipeLength;
}

export function shouldNotificationHaveSliding(notification, count) {
  if (count <= 1) return false;

  return (
    // sliding occurs only when having more than 1 notification shown
    count > 1
    // slide DOWN if container is top and insertion is at top
    && ((notification.insert === INSERTION.TOP && isTopContainer(notification.container))
    // slide UP if container is bottom and insertion is at bottom
    || (notification.insert === INSERTION.BOTTOM && isBottomContainer(notification.container)))
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

export function getHtmlClassesForType({ type, content, userDefinedTypes }) {
  if (content) {
    // return base class only if type is not defined
    return [NOTIFICATION_BASE_CLASS];
  }

  if (!userDefinedTypes) {
    // use existing type
    return htmlClassesForExistingType(type);
  }

  const foundType = userDefinedTypes.find(q => q.name === type);
  return [NOTIFICATION_BASE_CLASS].concat(foundType.htmlClasses);
}

export function getNotificationsForMobileView(notifications) {
  const top = [];
  const bottom = [];

  notifications.forEach((notification) => {
    const { container } = notification;
    if (isTopContainer(container)) {
      top.push(notification);
    } else if (isBottomContainer(container)) {
      bottom.push(notification);
    }
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
    const { container } = notification;
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

export function getTransition({ duration, timingFunction, delay }, property) {
  return `${duration}ms ${property} ${timingFunction} ${delay}ms`;
}

export function slidingExitTransition(notification) {
  return getTransition(notification.slidingExit, "all");
}

export function touchSwipeTransition(notification) {
  const { swipe } = notification.touchSlidingExit;
  return getTransition(swipe, "left");
}

export function touchFadeTransition(notification) {
  const { fade } = notification.touchSlidingExit;
  return getTransition(fade, "opacity");
}

function defaultAnimationIn(animationIn) {
  return animationIn || [];
}

function defaultAnimationOut(animationOut) {
  return animationOut || [];
}

function defaultTransition(transition, defaults) {
  const { duration, timingFunction, delay } = defaults;
  const transitionOptions = transition || {};

  if (isNull(transitionOptions.duration)) {
    transitionOptions.duration = duration;
  }

  if (isNull(transitionOptions.timingFunction)) {
    transitionOptions.timingFunction = timingFunction;
  }

  if (isNull(transitionOptions.delay)) {
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

function defaultDismiss(dismiss) {
  const option = dismiss;

  if (!option) {
    return {
      click: true,
      touch: true
    };
  }

  if (isNull(option.click)) {
    option.click = true;
  }

  if (isNull(option.touch)) {
    option.touch = true;
  }

  return option;
}

function defaultInsert(insert) {
  if (!insert) return "top";
  return insert.toLowerCase();
}

function defaultWidth(width) {
  if (isNull(width)) return 0;
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
    dismiss,
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
  notification.dismiss = defaultDismiss(dismiss);
  notification.animationIn = defaultAnimationIn(animationIn);
  notification.animationOut = defaultAnimationOut(animationOut);

  if (!isNull(width)) {
    notification.width = defaultWidth(width);
  }

  const slidingEnterDefaults = { duration: 600, timingFunction: "linear", delay: 0 };
  const slidingExitDefaults = { duration: 600, timingFunction: "linear", delay: 0 };
  const swipeBackDefaults = { duration: 600, timingFunction: "ease-in", delay: 0 };
  const swipeExitDefaults = { duration: 600, timingFunction: "ease-in", delay: 0 };
  const swipeCompleteDefaults = { duration: 300, timingFunction: "ease-in", delay: 0 };
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
