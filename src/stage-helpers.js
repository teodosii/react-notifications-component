import { cssWidth } from "./utils";
import {
  getHtmlClassesForType,
  getCubicBezierTransition
} from './helpers';

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

export function slidingExitTransition(notification) {
  return getCubicBezierTransition(
    notification.slidingExit.duration,
    notification.slidingExit.cubicBezier,
    notification.slidingExit.delay,
    "all"
  );
}

export function getChildStyleForTouchTransitionExit(notification, currentX, startX) {
  const horizontalLimit = window.innerWidth * 2;
  const touchSwipe = exports.touchSwipeTransition(notification);
  const touchFade = exports.touchFadeTransition(notification);

  return {
    opacity: 0,
    position: "relative",

    // set to slide to left or right when swiping based on X position
    left: `${currentX - startX >= 0 ? horizontalLimit : -horizontalLimit}px`,
    transition: `${touchSwipe}, ${touchFade}`
  };
}

export function handleTouchSlidingAnimationExit(notification, currentX, startX) {
  // set current html classes
  const animatedElementClasses = getHtmlClassesForType(notification);
  // set opacity and left to pull-out notification
  const childElementStyle = getChildStyleForTouchTransitionExit(notification, currentX, startX);
  // sliding out transition
  const slidingTransition = exports.slidingExitTransition(notification);

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
