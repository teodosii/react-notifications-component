import React from "react";
import { NOTIFICATION_STAGE } from "./constants";
import {
  getHtmlClassesForType,
  handleStageTransition,
  getCubicBezierTransition,
  hasFullySwiped,
  getRootHeightStyle,
  getInitialSlidingState,
  getIconHtmlContent,
  cssWidth
} from "./helpers";

export default class ReactNotification extends React.Component {
  constructor(props) {
    super(props);

    // methods binding
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.onNotificationClick = this.onNotificationClick.bind(this);
    this.setDismissTimeout = this.setDismissTimeout.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);

    // smart sliding end
    this.onSmartSlidingEnd = this.onSmartSlidingEnd.bind(this);
    this.onTouchSmartSlidingEnd = this.onTouchSmartSlidingEnd.bind(this);

    // touch events
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    // ref elements
    this.rootDOM = null;
    this.childDOM = null;

    // component's state
    this.state = getInitialSlidingState(props);
    this.timeoutId = null;
  }

  componentDidMount() {
    this.smartSliding();
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      // clear timeout if any
      clearTimeout(this.timeoutId);
    }
  }

  setDismissTimeout(duration) {
    const {
      notification,
      toggleTimeoutRemoval
    } = this.props;

    const timeoutDismissHandler = () => {
      this.setState({
        rootElementStyle: getRootHeightStyle(
          notification,
          this.rootDOM.scrollHeight
        )
      }, () => requestAnimationFrame(() => toggleTimeoutRemoval(notification)));
    };

    this.timeoutId = setTimeout(timeoutDismissHandler, duration);
  }

  setRemovalTimeout(dismiss) {
    if (dismiss && dismiss.duration) {
      this.setDismissTimeout(dismiss.duration);
    }
  }

  onAnimationEnd() {
    // set to be dismissed by timeout if `dismiss` option is set
    this.setRemovalTimeout(this.props.notification.dismiss);
  }

  onTransitionEnd() {
    // sliding has finished, we need to add animation by using classes
    const { notification } = this.props;

    // get html classes for type
    const animatedElementClasses = getHtmlClassesForType(notification);

    // this needs to be customized
    animatedElementClasses.push("visible");

    // look if animationIn array option has been filled in
    if (notification.animationIn && notification.animationIn.length > 0) {
      notification.animationIn.forEach(item => animatedElementClasses.push(item));
    }

    this.setState({
      animatedElementClasses,
      rootElementStyle: {
        height: "auto",
        width: cssWidth(notification.width)
      }
    });
  }

  onTouchSmartSlidingEnd(e) {
    // stop propagation of transitionEnd
    e.stopPropagation();

    if (!e.target.isSameNode(this.rootDOM)) {
      // skip if target is rootDOM node
      return;
    }

    if (this.endOfSmartSliding) {
      // remove notification
      this.props.toggleRemoval(this.props.notification);
    }

    // both animation and sliding have finished
    this.endOfSmartSliding = true;
  }

  onSmartSlidingEnd() {
    const { toggleRemoval, notification } = this.props;

    if (this.endOfSmartSliding) {
      toggleRemoval(notification);
    }

    // both animationEnd and transitionEnd have finished
    this.endOfSmartSliding = true;
  }

  smartSliding() {
    const { notification } = this.props;
    const { slidingEnter } = notification;

    const animatedElementClasses = getHtmlClassesForType(notification);
    const rootElementStyle = {
      // set sliding transition unless `resize` event has been fired
      // in which case we no longer slide nor animate
      transition: notification.resized
        ? undefined
        : getCubicBezierTransition(
          slidingEnter.duration,
          slidingEnter.cubicBezier,
          slidingEnter.delay
        ),

      // overwrite notification's width
      width: cssWidth(notification.width),

      // set height instead of auto
      height: `${this.rootDOM.scrollHeight}px`
    };

    // if `resize` has been fired then no animation is going to happen
    if (!notification.resized &&
      notification.animationIn &&
      notification.animationIn.length > 0) {
      notification.animationIn.forEach(item => animatedElementClasses.push(item));
    }

    this.setState({
      rootElementStyle,
      animatedElementClasses
    });
  }

  onNotificationClick() {
    const { notification } = this.props;

    this.setState({
      rootElementStyle: getRootHeightStyle(notification, this.rootDOM.scrollHeight)
    }, () => requestAnimationFrame(() => this.props.onClickHandler(notification)));
  }

  onTouchStart(e) {
    this.setState({
      startX: e.touches[0].pageX,
      currentX: e.touches[0].pageX
    });
  }

  onTouchMove(e) {
    const {
      notification,
      toggleTouchEnd
    } = this.props;

    // distance between start and current
    const distance = e.touches[0].pageX - this.state.startX;

    if (hasFullySwiped(distance)) {
      // move notification to the left/right by changing style
      this.setState({
        animatedElementClasses: getHtmlClassesForType(notification),
        rootElementStyle: getRootHeightStyle(
          notification,
          this.rootDOM.scrollHeight
        )
      }, () => {
        // remove notification from state
        requestAnimationFrame(() => toggleTouchEnd(notification));
      });
      return;
    }

    // swiping is still in place
    this.setState({
      currentX: e.touches[0].pageX,
      childElementStyle: {
        position: "relative",
        left: `${0 + distance}px`
      }
    });
  }

  onTouchEnd() {
    const { touchSlidingBack } = this.props.notification;

    this.setState({
      childElementStyle: {
        left: "0",
        position: "relative",
        transition: getCubicBezierTransition(
          touchSlidingBack.duration,
          touchSlidingBack.cubicBezier,
          touchSlidingBack.delay,
          "left"
        )
      }
    });
  }

  render() {
    const { notification } = this.props;
    let { childElementStyle } = this.state;
    let { onAnimationEnd } = this;
    let onNotificationClick = null;
    let onTransitionEnd = null;
    let touchHasEnded = false;

    if (this.state.hasSliding) {
      // set `onTransitionEnd` event if notification has sliding
      ({ onTransitionEnd } = this);
    }

    const stage = handleStageTransition(notification, this.state);
    const animatedElementClasses = (stage.animatedElementClasses || []).join(" ");
    let { rootElementStyle } = stage;

    if (notification.dismissable.click) {
      // set `onClick` event if notification is dismissable
      ({ onNotificationClick } = this);
    }

    if (notification.stage === NOTIFICATION_STAGE.REMOVAL) {
      onAnimationEnd = null;
      rootElementStyle = getRootHeightStyle(notification, this.rootDOM.scrollHeight);
    } else if (notification.stage === NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT) {
      onAnimationEnd = this.onSmartSlidingEnd;
      onTransitionEnd = this.onSmartSlidingEnd;
    } else if (notification.stage === NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT) {
      onAnimationEnd = this.onTouchSmartSlidingEnd;
      onTransitionEnd = this.onTouchSmartSlidingEnd;
      onNotificationClick = null;
      ({ childElementStyle } = stage);
      touchHasEnded = true;
    }

    if (notification.content) {
      return (
        <div
          onTouchStart={touchHasEnded ? null : this.onTouchStart}
          onTouchMove={touchHasEnded ? null : this.onTouchMove}
          onTouchEnd={touchHasEnded ? null : this.onTouchEnd}
          onTouchCancel={touchHasEnded ? null : this.onTouchEnd}
          onClick={onNotificationClick}
          className="notification-item-root"
          onAnimationEnd={onAnimationEnd}
          onTransitionEnd={onTransitionEnd}
          ref={(input) => { this.rootDOM = input; }}
          style={rootElementStyle}
        >
          <div
            className={animatedElementClasses}
            ref={(input) => { this.childDOM = input; }}
            style={childElementStyle}
          >
            {notification.content}
          </div>
        </div>
      );
    }

    const htmlCloseIconContent = getIconHtmlContent(notification, this.onClickHandler);

    return (
      <div
        onTouchStart={touchHasEnded ? null : this.onTouchStart}
        onTouchMove={touchHasEnded ? null : this.onTouchMove}
        onTouchEnd={touchHasEnded ? null : this.onTouchEnd}
        onTouchCancel={touchHasEnded ? null : this.onTouchEnd}
        onClick={onNotificationClick}
        className="notification-item-root"
        onAnimationEnd={onAnimationEnd}
        onTransitionEnd={onTransitionEnd}
        ref={(input) => { this.rootDOM = input; }}
        style={rootElementStyle}
      >
        <div
          className={animatedElementClasses}
          ref={(input) => { this.childDOM = input; }}
          style={childElementStyle}
        >
          <div className="notification-content">
            {htmlCloseIconContent}
            <div
              className="notification-close"
              onClick={this.onClickHandler}
            >
              <span>&times;</span>
            </div>
            <h4 className="notification-title">
              {this.props.notification.title}
            </h4>
            <p className="notification-message">
              {this.props.notification.message}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
