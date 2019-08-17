import React from 'react';
import PropTypes from 'prop-types';
import Timer from './timer';
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
      childStyle: { opacity: 0 },
      htmlClassList: getHtmlClassesForType(props.notification),
      animationPlayState: 'running',
      onTransitionEnd: null,
      touchEnabled: true
    };
  }

  static propTypes = {
    toggleRemoval: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    removed: PropTypes.bool
  }

  componentWillUnmount() {
    if (this.timeout) {
      this.timeout.clear();
    }
  }

  componentDidMount() {
    const { notification, count } = this.props;
    const willSlide = shouldNotificationHaveSliding(notification, count);

    const onTransitionEnd = () => {
      const { dismiss: { duration, onScreen, pauseOnHover } } = notification;
      if (duration > 0 && !onScreen && pauseOnHover) {
        this.timer = new Timer(() => this.removeNotification(''), duration);
      }
    };

    const callback = () => {
      requestAnimationFrame(() => {
        this.setState(prevState => ({
          childStyle: {
            opacity: 1
          },
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
      this.removeNotification('');
    }
  }

  removeNotification(removalFlag) {
    const { notification, toggleRemoval } = this.props;

    this.setState({
      parentStyle: {
        height: 0,
        transition: getTransition(notification.slidingExit, 'height')
      },
      onTransitionEnd: () => {
        toggleRemoval(notification.id, removalFlag);
      },
      htmlClassList: [
        ...notification.animationOut,
        ...getHtmlClassesForType(notification)
      ]
    });
  }

  getScrollHeight() {
    return this.rootElementRef.current.scrollHeight;
  }

  onClick() {
    this.removeNotification('');
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
      toggleRemoval,
      notification: { id, touchSlidingExit: { swipe, fade } }
    } = this.props;

    const [{ pageX }] = touches;
    const distance = pageX - startX;
    const swipeTo = window.innerWidth * 2;

    if (hasFullySwiped(distance)) {
      return this.setState({
        touchEnabled: false,
        parentStyle: {
          left: `${pageX - startX >= 0 ? swipeTo : -swipeTo}px`,
          position: 'relative',
          transition: `${getTransition(swipe, 'left')}, ${getTransition(fade, 'opacity')}`
        },
        onTransitionEnd: () => toggleRemoval(id, '')
      });
    }

    return this.setState({
      currentX: pageX,
      parentStyle: {
        position: 'relative',
        left: `${0 + distance}px`
      }
    });
  }

  onTouchEnd() {
    const { notification: { touchSlidingBack } } = this.props;

    this.setState({
      parentStyle: {
        left: 0,
        position: 'relative',
        transition: getTransition(touchSlidingBack, 'left')
      }
    });
  }

  onMouseEnter() {
    if (this.timeout) {
      this.timeout.pause();
    } else {
      this.setState({ animationPlayState: 'paused' });
    }
  }

  onMouseLeave() {
    if (this.timeout) {
      this.timeout.resume();
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

    const onAnimationEnd = () => this.removeNotification();

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
    const { childStyle, htmlClassList } = this.state;

    return (
      <div
        className={`${[...htmlClassList, 'n-child'].join(' ')}`}
        style={childStyle}
      >
        {notification.content}
      </div>
    );
  }

  renderNotification() {
    const { childStyle, htmlClassList } = this.state;
    const { notification: { dismiss: { duration, pauseOnHover } } } = this.props;
    const hasMouseEvents = duration > 0 && pauseOnHover;

    return (
      <div
        className={`${[...htmlClassList, 'n-child'].join(' ')}`}
        onMouseEnter={hasMouseEvents ? this.onMouseEnter : null}
        onMouseLeave={hasMouseEvents ? this.onMouseLeave : null}
        style={childStyle}
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
    const { parentStyle, onTransitionEnd, touchEnabled } = this.state;

    return (
      <div
        ref={this.rootElementRef}
        onClick={this.onClick}
        className='n-parent'
        style={parentStyle}
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
