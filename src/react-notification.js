import React from 'react';
import PropTypes from 'prop-types';
import Timer from './timer';
import { REMOVAL } from './constants';
import {
  getTransition,
  hasFullySwiped,
  getHtmlClassesForType,
  shouldNotificationHaveSliding
} from "src/helpers";

export default class ReactNotification extends React.Component {
  constructor(props) {
    super(props);
    this.rootElementRef = React.createRef();
    this.onClick = this.onClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.state = {
      parentStyle: { height: 0, overflow: 'hidden' },
      htmlClassList: getHtmlClassesForType(props.notification),
      animationPlayState: 'running',
      touchEnabled: true
    };
  }

  static propTypes = {
    toggleRemoval: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    removed: PropTypes.bool
  }

  componentWillUnmount() {
    if (this.timer) {
      this.timer.clear();
    }
  }

  componentDidMount() {
    const { notification, count } = this.props;
    const { dismiss: { duration, onScreen } } = notification;
    const willSlide = shouldNotificationHaveSliding(notification, count);

    const onTransitionEnd = () => {
      if (!duration || onScreen) return;

      // Will set timer only if duration > 0 and onScreen = false
      const callback = () => this.removeNotification(REMOVAL.TIMEOUT);
      this.timer = new Timer(callback, duration);
    };

    const callback = () => {
      requestAnimationFrame(() => {
        this.setState(prevState => ({
          htmlClassList: [
            ...notification.animationIn,
            ...prevState.htmlClassList, 
          ]
        }));
      })
    }

    this.setState({
      parentStyle: {
        height: `${this.getScrollHeight()}px`,
        transition: willSlide
          ? getTransition(notification.slidingEnter, 'height')
          : '10ms height'
      },
      onTransitionEnd
    }, callback);
  }

  componentDidUpdate({ removed }) {
    if (this.props.removed && !removed) {
      this.removeNotification(REMOVAL.MANUAL);
    }
  }

  removeNotification(removalFlag) {
    const { notification, toggleRemoval } = this.props;
    const { dismiss: { waitForAnimation } } = notification;
    const htmlClassList = [
      ...notification.animationOut,
      ...getHtmlClassesForType(notification)
    ];

    const parentStyle = {
      height: 0,
      transition: getTransition(notification.slidingExit, 'height')
    };

    const onTransitionEnd = () => toggleRemoval(notification.id, removalFlag);

    if (waitForAnimation) {
      return this.setState({
        htmlClassList,
        onAnimationEnd: () => {
          this.setState({
            parentStyle,
            onTransitionEnd
          });
        }
      })
    }

    this.setState({
      parentStyle,
      onTransitionEnd,
      htmlClassList
    });
  }

  getScrollHeight() {
    return this.rootElementRef.current.scrollHeight;
  }

  onClick() {
    this.removeNotification(REMOVAL.CLICK);
  }

  onTouchStart({ touches }) {
    const [{ pageX }] = touches;
    this.setState({
      startX: pageX,
      currentX: pageX
    });
  }

  onTouchMove({ touches }) {
    const { startX } = this.state;
    const {
      notification,
      toggleRemoval,
      notification: {
        id,
        slidingExit,
        touchSlidingExit: { swipe, fade }
      }
    } = this.props;

    const [{ pageX }] = touches;
    const distance = pageX - startX;
    const swipeTo = window.innerWidth * 2;

    if (hasFullySwiped(distance)) {
      return this.setState(({ parentStyle }) => ({
        touchEnabled: false,
        parentStyle: {
          position: 'relative',
          left: `${pageX - startX >= 0 ? swipeTo : -swipeTo}px`,
          transition: `${getTransition(swipe, 'left')}, ${getTransition(fade, 'opacity')}`,
          height: parentStyle.height
        },
        htmlClassList: [
          ...notification.animationOut,
          ...getHtmlClassesForType(notification)
        ],
        onTransitionEnd: () => {
          this.setState(({ parentStyle }) => ({
            parentStyle: {
              height: 0,
              left: parentStyle.left,
              position: 'relative',
              transition: `${getTransition(slidingExit, 'height')}`
            },
            onTransitionEnd: () => toggleRemoval(id, '')
          }));
        }
      }));
    }

    return this.setState(({ parentStyle }) => ({
      currentX: pageX,
      parentStyle: {
        position: 'relative',
        height: parentStyle.height,
        left: `${0 + distance}px`
      }
    }));
  }

  onTouchEnd() {
    const { notification: { touchSlidingBack } } = this.props;

    this.setState(({ parentStyle }) => ({
      parentStyle: {
        left: 0,
        position: 'relative',
        height: parentStyle.height,
        transition: getTransition(touchSlidingBack, 'left')
      }
    }));
  }

  onMouseEnter() {
    if (this.timer) {
      this.timer.pause();
    } else {
      this.setState({ animationPlayState: 'paused' });
    }
  }

  onMouseLeave() {
    if (this.timer) {
      this.timer.resume();
    } else {
      this.setState({ animationPlayState: 'running' });
    }
  }

  renderTitle() {
    const { notification: { title } } = this.props;
    if (!title) return null;
    return (
      <p className="notification-title">
        {title}
      </p>
    );
  }

  renderMessage() {
    const { notification: { message } } = this.props;
    return (
      <p className="notification-message">
        {message}
      </p>
    );
  }

  renderCloseIcon() {
    return (
      <div
        className="notification-close"
        onClick={this.onClick}
      ></div>
    );
  }

  renderTimer() {
    const { notification: { dismiss } } = this.props;
    const { duration, onScreen } = dismiss;
    const { animationPlayState } = this.state;

    if (!onScreen) return;

    const style = {
      animationName: 'timer',
      animationDuration: `${duration}ms`,
      animationTimingFunction: 'linear',
      animationFillMode: 'forwards',
      animationDelay: 0,
      animationPlayState
    };

    const onAnimationEnd = () => this.removeNotification(REMOVAL.TIMEOUT);

    return (
      <div className="timer">
        <div
          className="timer-filler"
          onAnimationEnd={onAnimationEnd}
          style={style}
        >
        </div>
      </div>
    );
  }

  renderCustomContent() {
    const { notification } = this.props;
    const { htmlClassList } = this.state;

    return (
      <div
        className={`${[...htmlClassList, 'n-child'].join(' ')}`}
      >
        {notification.content}
      </div>
    );
  }

  renderNotification() {
    const { htmlClassList } = this.state;
    const { notification: { dismiss: { duration, pauseOnHover } } } = this.props;
    const hasMouseEvents = duration > 0 && pauseOnHover;

    return (
      <div
        className={`${[...htmlClassList, 'n-child'].join(' ')}`}
        onMouseEnter={hasMouseEvents ? this.onMouseEnter : null}
        onMouseLeave={hasMouseEvents ? this.onMouseLeave : null}
      >
        <div className="notification-content">
          { this.renderCloseIcon() }
          { this.renderTitle() }
          { this.renderMessage() }
          { this.renderTimer() }
        </div>
      </div>
    );
  }

  render() {
    const { notification: { content } } = this.props;
    const {
      parentStyle,
      onAnimationEnd,
      onTransitionEnd,
      touchEnabled
    } = this.state;

    return (
      <div
        ref={this.rootElementRef}
        onClick={this.onClick}
        className='n-parent'
        style={parentStyle}
        onAnimationEnd={onAnimationEnd}
        onTransitionEnd={onTransitionEnd}
        onTouchStart={touchEnabled ? this.onTouchStart : null}
        onTouchMove={touchEnabled ? this.onTouchMove : null}
        onTouchEnd={touchEnabled ? this.onTouchEnd : null}
      >
        {
          content
            ? this.renderCustomContent()
            : this.renderNotification()
        }
      </div>
    )
  }
}
