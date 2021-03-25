import store from 'src/store';
import {
  iDismiss,
  iNotification,
  iNotificationCustomType,
  iTouchTransition,
  iTransition
} from 'src/components/Notification';
import {
  INSERTION,
  NOTIFICATION_BASE_CLASS,
  NOTIFICATION_CONTAINER,
  NOTIFICATION_TYPE,
  NOTIFICATION_TYPE as NT
} from 'src/utils/constants';

export const isNull = (object: any) => object === null || object === undefined;

export function isBottomContainer(container: string) {
  return (
    container === NOTIFICATION_CONTAINER.BOTTOM_FULL ||
    container === NOTIFICATION_CONTAINER.BOTTOM_LEFT ||
    container === NOTIFICATION_CONTAINER.BOTTOM_RIGHT ||
    container === NOTIFICATION_CONTAINER.BOTTOM_CENTER
  );
}

export function isTopContainer(container: string) {
  return (
    container === NOTIFICATION_CONTAINER.TOP_FULL ||
    container === NOTIFICATION_CONTAINER.TOP_LEFT ||
    container === NOTIFICATION_CONTAINER.TOP_RIGHT ||
    container === NOTIFICATION_CONTAINER.TOP_CENTER
  );
}

export function hasFullySwiped(diffX: number, width: number) {
  const swipeLength = Math.abs(diffX);
  const requiredSwipeLength = (40 / 100) * width;
  return swipeLength >= requiredSwipeLength;
}

export function shouldNotificationHaveSliding(notification: iNotification, count: number) {
  if (count <= 1) {
    return false;
  }

  return (
    count > 1 &&
    ((notification.insert === INSERTION.TOP && isTopContainer(notification.container)) ||
      (notification.insert === INSERTION.BOTTOM && isBottomContainer(notification.container)) ||
      notification.container === NOTIFICATION_CONTAINER.CENTER)
  );
}

export function htmlClassesForExistingType(type: NOTIFICATION_TYPE) {
  switch (type) {
    case NT.DEFAULT:
      return [NOTIFICATION_BASE_CLASS, 'notification__item--default'];
    case NT.SUCCESS:
      return [NOTIFICATION_BASE_CLASS, 'notification__item--success'];
    case NT.DANGER:
      return [NOTIFICATION_BASE_CLASS, 'notification__item--danger'];
    case NT.WARNING:
      return [NOTIFICATION_BASE_CLASS, 'notification__item--warning'];
    case NT.INFO:
      return [NOTIFICATION_BASE_CLASS, 'notification__item--info'];
    default:
      return [NOTIFICATION_BASE_CLASS];
  }
}

export function getHtmlClassesForType(notification: iNotification) {
  const { type, content, userDefinedTypes } = notification;
  const base = [NOTIFICATION_BASE_CLASS];
  if (content) {
    return base;
  }

  if (isNull(userDefinedTypes)) {
    return htmlClassesForExistingType(type);
  }

  const foundType = userDefinedTypes.find((q) => q.name === type);
  return base.concat(foundType.htmlClasses);
}

export function getNotificationsForMobileView(notifications: iNotification[]) {
  const top: iNotification[] = [];
  const bottom: iNotification[] = [];

  notifications.forEach((notification) => {
    const { container } = notification;
    const { CENTER } = NOTIFICATION_CONTAINER;

    if (isTopContainer(container) || container === CENTER) {
      top.push(notification);
    } else if (isBottomContainer(container)) {
      bottom.push(notification);
    }
  });

  return { top, bottom };
}

export function getNotificationsForEachContainer(notifications: iNotification[]) {
  const topLeft: iNotification[] = [];
  const topRight: iNotification[] = [];
  const topCenter: iNotification[] = [];
  const bottomLeft: iNotification[] = [];
  const bottomRight: iNotification[] = [];
  const bottomCenter: iNotification[] = [];
  const center: iNotification[] = [];
  const topFull: iNotification[] = [];
  const bottomFull: iNotification[] = [];

  notifications.forEach((notification) => {
    const { container } = notification;
    if (container === NOTIFICATION_CONTAINER.TOP_FULL) {
      topFull.push(notification);
    } else if (container === NOTIFICATION_CONTAINER.BOTTOM_FULL) {
      bottomFull.push(notification);
    } else if (container === NOTIFICATION_CONTAINER.TOP_LEFT) {
      topLeft.push(notification);
    } else if (container === NOTIFICATION_CONTAINER.TOP_RIGHT) {
      topRight.push(notification);
    } else if (container === NOTIFICATION_CONTAINER.TOP_CENTER) {
      topCenter.push(notification);
    } else if (container === NOTIFICATION_CONTAINER.BOTTOM_LEFT) {
      bottomLeft.push(notification);
    } else if (container === NOTIFICATION_CONTAINER.BOTTOM_RIGHT) {
      bottomRight.push(notification);
    } else if (container === NOTIFICATION_CONTAINER.BOTTOM_CENTER) {
      bottomCenter.push(notification);
    } else if (container === NOTIFICATION_CONTAINER.CENTER) {
      center.push(notification);
    }
  });

  return {
    topFull,
    bottomFull,
    topLeft,
    topRight,
    topCenter,
    bottomLeft,
    bottomRight,
    bottomCenter,
    center
  };
}

export function getTransition({ duration, timingFunction, delay }: iTransition, property: string) {
  return `${duration}ms ${property} ${timingFunction} ${delay}ms`;
}

function defaultTransition(
  transition: iTransition,
  { duration, timingFunction, delay }: iTransition
) {
  const transitionOptions = transition || ({} as iTransition);

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

function defaultDismiss(dismiss: iDismiss): iDismiss {
  const option = dismiss;
  const defaults: iDismiss = {
    duration: 0,
    click: true,
    touch: true,
    onScreen: false,
    pauseOnHover: false,
    waitForAnimation: false,
    showIcon: false
  };

  if (!option) {
    return defaults;
  }

  Object.keys(defaults).forEach((prop) => {
    if (isNull(option[prop])) {
      option[prop] = defaults[prop];
    }
  });

  return option;
}

function defaultUserDefinedTypes(
  notification: iNotification,
  definedTypes: iNotificationCustomType[]
) {
  const { content, type } = notification;
  if (content) {
    return undefined;
  }

  if (
    type === NT.SUCCESS ||
    type === NT.DANGER ||
    type === NT.INFO ||
    type === NT.DEFAULT ||
    type === NT.WARNING ||
    !definedTypes
  ) {
    return undefined;
  }

  return definedTypes;
}

export function parseNotification(
  options: iNotification,
  userDefinedTypes: iNotificationCustomType[],
  defaultNotificationWidth: number
): iNotification {
  const notification = options;
  const {
    id,
    type,
    insert,
    content,
    container,
    animationIn,
    animationOut,
    slidingEnter,
    slidingExit,
    touchRevert,
    touchSlidingExit,
    dismiss,
    width,
    onRemoval
  } = notification;

  notification.id = id || store.getCounter().toString();
  notification.type = content ? null : (type.toLowerCase() as NOTIFICATION_TYPE);

  if (userDefinedTypes && !content) {
    notification.userDefinedTypes = defaultUserDefinedTypes(notification, userDefinedTypes);
  }

  notification.width = isNull(width) ? defaultNotificationWidth : width;
  notification.container = container.toLowerCase() as NOTIFICATION_CONTAINER;
  notification.insert = (insert || 'top').toLowerCase() as INSERTION;
  notification.dismiss = defaultDismiss(dismiss);
  notification.animationIn = animationIn || [];
  notification.animationOut = animationOut || [];
  notification.onRemoval = onRemoval || (() => {});

  const t = (duration: number, timingFunction: string, delay: number) => ({
    duration,
    timingFunction,
    delay
  });

  notification.slidingEnter = defaultTransition(slidingEnter, t(600, 'linear', 0));
  notification.slidingExit = defaultTransition(slidingExit, t(600, 'linear', 0));
  notification.touchRevert = defaultTransition(touchRevert, t(600, 'linear', 0));

  const touchExit = touchSlidingExit || ({} as { fade: iTransition, swipe: iTransition });
  const swipe = touchExit.swipe || ({} as iTransition);
  const fade = touchExit.fade || ({} as iTransition);
  notification.touchSlidingExit = touchExit;
  notification.touchSlidingExit.swipe = defaultTransition(swipe, t(600, 'linear', 0));
  notification.touchSlidingExit.fade = defaultTransition(fade, t(300, 'linear', 0));

  return notification;
}
