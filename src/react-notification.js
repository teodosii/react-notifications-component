import React from "react";
import { NOTIFICATION_STAGE } from "src/constants";
import { cssWidth } from "src/utils";
import {
  getHtmlClassesForType,
  handleStageTransition,
  getCubicBezierTransition,
  hasFullySwiped,
  getRootHeightStyle,
  getInitialSlidingState
} from "src/helpers";

export default class ReactNotification extends React.Component {
  constructor(props) {
    super(props);

    this.endOfSmartSliding = false;

    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.onNotificationClick = this.onNotificationClick.bind(this);
    this.onSmartSlidingEnd = this.onSmartSlidingEnd.bind(this);
    this.onTouchSmartSlidingEnd = this.onTouchSmartSlidingEnd.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    // ref elements
    this.rootDOM = React.createRef();

    // component's state
    this.state = getInitialSlidingState(props);
  }

  componentDidMount() {
    // Start sliding
    this.smartSliding();

    // Set notification to be dismissed by timeout
    this.setRemovalTimeout(this.props.notification.dismiss);
  }

  componentWillUnmount() {
    if (!this.timeoutId) return;
    clearTimeout(this.timeoutId);
  }

  getScrollHeight() {
    return this.rootDOM.current.scrollHeight;
  }

  dismissHandler() {
    const { notification, toggleTimeoutRemoval } = this.props;
    const { MANUAL_REMOVAL: ML, TOUCH_SLIDING_ANIMATION_EXIT: TS } = NOTIFICATION_STAGE;

    // Skip timeout removal if it's already in a removal process
    if (notification.stage === ML || notification.stage === TS) return;
    const callback = () => requestAnimationFrame(() => toggleTimeoutRemoval(notification));
    const state = { rootElementStyle: getRootHeightStyle(notification, this.getScrollHeight()) };

    this.setState(state, callback);
  }

  setRemovalTimeout(dismiss) {
    if (dismiss && dismiss.duration > 0) {
      this.timeoutId = setTimeout(
        () => this.dismissHandler(),
        dismiss.duration
      );
    }
  }

  onTransitionEnd() {
    // Sliding has finished
    // We now need to add CSS classes to animate

    const { notification } = this.props;
    const { animationIn } = notification;

    // Get html classes for type
    let animatedElementClasses = getHtmlClassesForType(notification);
    // Make element visible now
    animatedElementClasses.push("notification-visible");
    // Append animation classes
    animatedElementClasses = animatedElementClasses.concat(animationIn || []);

    this.setState({
      animatedElementClasses,
      rootElementStyle: {
        height: "auto",
        width: cssWidth(notification.width)
      }
    });
  }

  onTouchSmartSlidingEnd(event) {
    // Stop propagation of transitionEnd
    event.stopPropagation();

    // Skip if target is rootDOM node
    if (!event.target.isSameNode(this.rootDOM.current)) return;

    if (this.endOfSmartSliding) {
      const { toggleRemoval, notification } = this.props;
      toggleRemoval(notification);
    }

    // Both animation and sliding have finished
    this.endOfSmartSliding = true;
  }

  onSmartSlidingEnd() {
    const { toggleRemoval, notification } = this.props;
    const { animationOut } = notification;

    if (!animationOut || !animationOut.length || this.endOfSmartSliding) {
      toggleRemoval(notification);
    }

    // Both animationEnd and transitionEnd have finished
    this.endOfSmartSliding = true;
  }

  smartSliding() {
    const { notification } = this.props;
    const { slidingEnter, animationIn, resized } = notification;

    const animatedElementClasses = getHtmlClassesForType(notification);
    const rootElementStyle = {
      // Set sliding transition unless `resize` event has been fired
      // in which case we no longer slide nor animate
      transition: resized
        ? undefined
        : getCubicBezierTransition(
          slidingEnter.duration,
          slidingEnter.cubicBezier,
          slidingEnter.delay
        ),

      // Overwrite notification's width
      width: cssWidth(notification.width),

      // Set height instead of auto
      height: `${this.getScrollHeight()}px`
    };

    // If resize has been fired then no animation is going to happen
    if (!resized && animationIn && animationIn.length > 0) {
      animationIn.forEach(item => animatedElementClasses.push(item));
    }

    this.setState({
      rootElementStyle,
      animatedElementClasses
    });
  }

  onNotificationClick() {
    const { notification, onClickHandler } = this.props;
    const rootElementStyle = getRootHeightStyle(notification, this.getScrollHeight());
    const callback = () => requestAnimationFrame(() => onClickHandler(notification));

    this.setState({ rootElementStyle }, callback);
  }

  onTouchStart(event) {
    const { pageX } = event.touches[0];
    this.setState({ startX: pageX, currentX: pageX });
  }

  onTouchMove(event) {
    const { notification, toggleTouchEnd } = this.props;
    const { pageX } = event.touches[0];
    const { startX } = this.state;
    const distance = pageX - startX;

    if (hasFullySwiped(distance)) {
      const state = {
        animatedElementClasses: getHtmlClassesForType(notification),
        rootElementStyle: getRootHeightStyle(notification, this.getScrollHeight())
      };
      
      const callback = () => requestAnimationFrame(() => toggleTouchEnd(notification));
      return this.setState(state, callback);
    }

    return this.setState({
      currentX: pageX,
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

  renderCloseIcon({ dismissIcon }) {
    if (dismissIcon) {
      return (
        <div
          className={dismissIcon.className}
          onClick={this.onNotificationClick}
        >
          {dismissIcon.content}
        </div>
      );
    }

    return (
      <div
        className="notification-close"
        onClick={this.onNotificationClick}
      >
        <span>&times;</span>
      </div>
    );
  }

  renderNotificationTitle(notification) {
    if (notification.title) {
      return (
        <p className="notification-title">
          {notification.title}
        </p>
      );
    }

    return null;
  }

  render() {
    const { notification } = this.props;
    let { childElementStyle, hasSliding } = this.state;
    let { onAnimationEnd } = this;
    let onNotificationClick = null;
    let touchHasEnded = false;

    // Set onTransitionEnd event if notification has sliding
    let onTransitionEnd = hasSliding ? this.onTransitionEnd : null;
    const stage = handleStageTransition(notification, this.state);
    const animatedElementClasses = (stage.animatedElementClasses || []).join(" ");
    let { rootElementStyle } = stage;

    // Set onClick event if notification is dismissable
    if (notification.dismissable.click) {
      ({ onNotificationClick } = this);
    }

    const {
      MANUAL_REMOVAL: ML,
      SLIDING_ANIMATION_EXIT: SE,
      TOUCH_SLIDING_ANIMATION_EXIT: TSE
    } = NOTIFICATION_STAGE;

    if (notification.stage === ML) {
      onAnimationEnd = null;
      rootElementStyle = getRootHeightStyle(notification, this.getScrollHeight());
    } else if (notification.stage === SE) {
      onAnimationEnd = this.onSmartSlidingEnd;
      onTransitionEnd = this.onSmartSlidingEnd;
    } else if (notification.stage === TSE) {
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
            { this.renderCloseIcon(notification) }
            { this.renderNotificationTitle(notification) }
            <p className="notification-message">
              { notification.message }
            </p>
          </div>
        </div>
      </div>
    );
  }
}
