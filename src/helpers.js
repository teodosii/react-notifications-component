import {
  CONTAINER,
  INSERTION,
  NOTIFICATION_BASE_CLASS,
  NOTIFICATION_TYPE as NT,
} from "src/constants";
import {
  isNullOrUndefined,
  getRandomId
} from "src/utils";

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

export function getTransition({ duration, cubicBezier, delay }, property) {
  return `${duration}ms ${property} ${cubicBezier} ${delay}ms`;
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
