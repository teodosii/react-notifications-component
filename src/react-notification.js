import React from "react";
import { NOTIFICATION_STAGE } from "src/constants";
import { cssWidth } from "src/utils";
import {
  getHtmlClassesForType,
  handleStageTransition,
  getCubicBezierTransition,
  hasFullySwiped,
  getRootHeightStyle,
  getInitialSlidingState,
  getIconHtmlContent
} from "src/helpers";

export default class ReactNotification extends React.Component {
  constructor(props) {
    super(props);

    this.endOfSmartSliding = false;

    // methods binding
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.onNotificationClick = this.onNotificationClick.bind(this);
    this.setDismissTimeout = this.setDismissTimeout.bind(this);

    // smart sliding end
    this.onSmartSlidingEnd = this.onSmartSlidingEnd.bind(this);
    this.onTouchSmartSlidingEnd = this.onTouchSmartSlidingEnd.bind(this);

    // touch events
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    // ref elements
    this.rootDOM = React.createRef();

    // component's state
    this.state = getInitialSlidingState(props);
  }

  componentDidMount() {
    // start sliding
    this.smartSliding();

    // set notification to be dismissed by timeout
    this.setRemovalTimeout(this.props.notification.dismiss);
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      this.timeoutId = clearTimeout(this.timeoutId);
    }
  }

  setDismissTimeout(duration) {
    // timeout handler
    const timeoutDismissHandler = () => {
      const { notification, toggleTimeoutRemoval } = this.props;

      // skip timeout removal if it's already in a removal process
      if (notification.stage === NOTIFICATION_STAGE.MANUAL_REMOVAL
        || notification.stage === NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT) return;

      this.setState({
        rootElementStyle: getRootHeightStyle(
          notification,
          this.rootDOM.current.scrollHeight
        )
      }, () => requestAnimationFrame(() => toggleTimeoutRemoval(notification)));
    };

    // set timeout to automatically dismiss notification
    this.timeoutId = setTimeout(timeoutDismissHandler, duration);
  }

  setRemovalTimeout(dismiss) {
    if (dismiss && dismiss.duration > 0) {
      // make sure option is defined and set
      this.setDismissTimeout(dismiss.duration);
    }
  }

  onTransitionEnd() {
    // sliding has finished, we need to add CSS classes to animate

    const { notification } = this.props;
    const { animationIn } = notification;

    // get html classes for type
    let animatedElementClasses = getHtmlClassesForType(notification);

    // make element visible now
    animatedElementClasses.push("notification-visible");

    // append animation classes
    animatedElementClasses = animatedElementClasses.concat(animationIn || []);

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

    if (!e.target.isSameNode(this.rootDOM.current)) {
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
    const { notification } = this.props;

    if (
      !notification.animationOut
      || !notification.animationOut.length
      || this.endOfSmartSliding
    ) {
      this.props.toggleRemoval(notification);
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
      height: `${this.rootDOM.current.scrollHeight}px`
    };

    // if `resize` has been fired then no animation is going to happen
    if (!notification.resized
      && notification.animationIn
      && notification.animationIn.length > 0) {
      notification.animationIn.forEach(item => animatedElementClasses.push(item));
    }

    this.setState({
      rootElementStyle,
      animatedElementClasses
    });
  }

  onNotificationClick() {
    const { notification } = this.props;

    const rootElementStyle = getRootHeightStyle(
      notification,
      this.rootDOM.current.scrollHeight
    );

    this.setState({
      rootElementStyle
    }, () => requestAnimationFrame(() => {
      this.props.onClickHandler(notification);
    }));
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
          this.rootDOM.current.scrollHeight
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
    let touchHasEnded = false;

    // set onTransitionEnd event if notification has sliding
    let onTransitionEnd = this.state.hasSliding
      ? this.onTransitionEnd
      : null;

    const stage = handleStageTransition(notification, this.state);
    const animatedElementClasses = (stage.animatedElementClasses || []).join(" ");
    let { rootElementStyle } = stage;

    // set `onClick` event if notification is dismissable
    if (notification.dismissable.click) {
      ({ onNotificationClick } = this);
    }

    if (notification.stage === NOTIFICATION_STAGE.MANUAL_REMOVAL) {
      onAnimationEnd = null;
      rootElementStyle = getRootHeightStyle(notification, this.rootDOM.current.scrollHeight);
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
          ref={this.rootDOM}
          style={rootElementStyle}
        >
          <div
            className={`${animatedElementClasses} notification-item-child`}
            style={childElementStyle}
          >
            {notification.content}
          </div>
        </div>
      );
    }

    const icon = <div
      className="notification-close"
      onClick={this.onNotificationClick}>
      <span>&times;</span>
    </div>;

    const htmlCloseIconContent = notification.dismissIcon
      ? getIconHtmlContent(notification, this.onNotificationClick)
      : icon;

    let notificationTitle;
    if (notification.title) {
      notificationTitle = <h4 className="notification-title">{notification.title}</h4>;
    }

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
        ref={this.rootDOM}
        style={rootElementStyle}
      >
        <div
          className={`${animatedElementClasses} notification-item-child`}
          style={childElementStyle}
        >
          <div className="notification-content">
            {htmlCloseIconContent}
            {notificationTitle}
            <p className="notification-message">
              {this.props.notification.message}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
