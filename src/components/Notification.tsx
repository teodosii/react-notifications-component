import PropTypes from 'prop-types';
import React from 'react';
import { iNotification } from 'src/types/Notification';
import { REMOVAL } from '../utils/constants';
import { getHtmlClassesForType, getTransition, hasFullySwiped, shouldNotificationHaveSliding } from '../utils/helpers';
import Timer from '../utils/timer';

class iNotificationProps {
  id: string;
  notification: iNotification;
  count: number;
  removed: boolean;
  toggleRemoval: (id: string, callback: () => void) => void;
}

interface iNotificationState {
  parentStyle?: iParentStyle;
  htmlClassList?: string[];
  animationPlayState?: string;
  touchEnabled?: boolean;
  onTransitionEnd?: (event: React.TransitionEvent<HTMLDivElement>) => void;
  onAnimationEnd?: (event: React.AnimationEvent<HTMLDivElement>) => void;
  startX?: number;
  currentX?: number;
}

interface iParentStyle {
  height?: string;
  overflow?: string;
  width?: string;
  transition?: string;
}

class Notification extends React.Component<iNotificationProps, iNotificationState> {
  constructor(props: iNotificationProps) {
    super(props);
    this.rootElementRef = React.createRef();
    this.onClick = this.onClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    const { width } = props.notification;

    this.state = {
      parentStyle: {
        height: `0px`,
        overflow: 'hidden',
        width: width ? `${width}px` : '100%'
      },
      htmlClassList: getHtmlClassesForType(props.notification),
      animationPlayState: 'running',
      touchEnabled: true
    };
  }

  private readonly rootElementRef: React.RefObject<HTMLDivElement>;
  private timer: Timer;

  static propTypes = {
    toggleRemoval: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    removed: PropTypes.bool
  };

  componentWillUnmount() {
    if (this.timer) {
      this.timer.clear();
    }
  }

  componentDidMount() {
    const { notification, count } = this.props;
    const {
      dismiss: { duration, onScreen }
    } = notification;
    const { scrollHeight } = this.rootElementRef.current;
    const willSlide = shouldNotificationHaveSliding(notification, count);

    const onTransitionEnd = () => {
      if (!duration || onScreen) {
        return;
      }
      const callback = () => this.removeNotification(REMOVAL.TIMEOUT);
      this.timer = new Timer(callback, duration);
    };

    const callback = () => {
      requestAnimationFrame(() => {
        this.setState((prevState) => ({
          htmlClassList: [...notification.animationIn, ...prevState.htmlClassList]
        }));
      });
    };

    this.setState(
      ({ parentStyle: { width } }) => ({
        parentStyle: {
          width,
          height: `${scrollHeight}px`,
          transition: willSlide ? getTransition(notification.slidingEnter, 'height') : '10ms height'
        },
        onTransitionEnd
      }),
      callback
    );
  }

  componentDidUpdate({ removed }) {
    if (this.props.removed && !removed) {
      this.removeNotification(REMOVAL.MANUAL);
    }
  }

  removeNotification(removalFlag: string) {
    const { notification, toggleRemoval } = this.props;
    const {
      id,
      onRemoval,
      dismiss: { waitForAnimation }
    } = notification;
    const htmlClassList = [...notification.animationOut, ...getHtmlClassesForType(notification)];

    const onTransitionEnd = () => toggleRemoval(id, () => onRemoval(id, removalFlag));
    const parentStyle: iParentStyle = {
      height: `0px`,
      transition: getTransition(notification.slidingExit, 'height')
    };

    if (waitForAnimation) {
      return this.setState(({ parentStyle: { width } }) => ({
        htmlClassList,
        onAnimationEnd: () => {
          this.setState({
                          parentStyle: {
                            width,
                            ...parentStyle
                          },
                          onTransitionEnd
                        });
        }
      }));
    }

    return this.setState(({ parentStyle: { width } }) => ({
      parentStyle: {
        width,
        ...parentStyle
      },
      onTransitionEnd,
      htmlClassList
    }));
  }

  onClick() {
    const {
      notification: { dismiss }
    } = this.props;
    if (dismiss.click || dismiss.showIcon) {
      this.removeNotification(REMOVAL.CLICK);
    }
  }

  onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const { pageX } = event.touches[0];

    this.setState(({ parentStyle }) => ({
      startX: pageX,
      currentX: pageX,
      parentStyle: {
        ...parentStyle,
        position: 'relative'
      }
    }));
  }

  onTouchMove(event: React.TouchEvent) {
    const { pageX } = event.touches[0];
    const { startX } = this.state;
    const {
      toggleRemoval,
      notification: {
        id,
        onRemoval,
        slidingExit,
        touchSlidingExit: { swipe, fade }
      }
    } = this.props;

    const distance = pageX - startX;
    const { offsetWidth: width } = this.rootElementRef.current;
    const swipeTo = window.innerWidth + width;
    const left = `${pageX - startX >= 0 ? swipeTo : -swipeTo}px`;

    if (hasFullySwiped(distance, width)) {
      const t1 = getTransition(swipe, 'left');
      const t2 = getTransition(fade, 'opacity');
      const onTransitionEnd = () => {
        toggleRemoval(id, () => onRemoval(id, REMOVAL.TOUCH));
      };

      return this.setState(({ parentStyle }) => ({
        touchEnabled: false,
        parentStyle: {
          ...parentStyle,
          left,
          opacity: 0,
          transition: `${t1}, ${t2}`
        },
        onTransitionEnd: () => {
          this.setState(({ parentStyle }) => ({
            parentStyle: {
              ...parentStyle,
              height: `0px`,
              transition: getTransition(slidingExit, 'height')
            },
            onTransitionEnd
          }));
        }
      }));
    }

    return this.setState(({ parentStyle }) => ({
      currentX: pageX,
      parentStyle: {
        ...parentStyle,
        left: `${0 + distance}px`
      }
    }));
  }

  onTouchEnd() {
    const {
      notification: { touchRevert }
    } = this.props;

    this.setState(({ parentStyle }) => ({
      parentStyle: {
        ...parentStyle,
        left: 0,
        transition: getTransition(touchRevert, 'left')
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

  renderTimer() {
    const {
      notification: { dismiss }
    } = this.props;
    const { duration, onScreen } = dismiss;
    const { animationPlayState } = this.state;

    if (!duration || !onScreen) {
      return;
    }

    const style = {
      animationName: 'timer',
      animationDuration: `${duration}ms`,
      animationTimingFunction: 'linear',
      animationFillMode: 'forwards',
      animationDelay: `0`,
      animationPlayState
    };

    const onAnimationEnd = () => this.removeNotification(REMOVAL.TIMEOUT);
    return (
      <div className="timer">
        <div className="timer-filler" onAnimationEnd={onAnimationEnd} style={style}></div>
      </div>
    );
  }

  renderCustomContent() {
    const { htmlClassList } = this.state;
    const {
      notification: {
        id,
        content: CustomContent,
        dismiss: { duration, pauseOnHover }
      }
    } = this.props;

    const hasMouseEvents = duration > 0 && pauseOnHover;

    return (
      <div
        className={`${[...htmlClassList, 'n-child'].join(' ')}`}
        onMouseEnter={hasMouseEvents ? this.onMouseEnter : null}
        onMouseLeave={hasMouseEvents ? this.onMouseLeave : null}
      >
        {React.isValidElement(CustomContent) ? CustomContent : <CustomContent {...{ id }} />}
      </div>
    );
  }

  renderNotification() {
    const {
      notification: {
        title,
        message,
        dismiss: { showIcon, duration, pauseOnHover }
      }
    } = this.props;
    const { htmlClassList } = this.state;
    const hasMouseEvents = duration > 0 && pauseOnHover;

    return (
      <div
        className={`${[...htmlClassList, 'n-child'].join(' ')}`}
        onMouseEnter={hasMouseEvents ? this.onMouseEnter : null}
        onMouseLeave={hasMouseEvents ? this.onMouseLeave : null}
      >
        <div className="notification-content">
          {showIcon && <div className="notification-close" onClick={this.onClick}></div>}
          {title && <div className="notification-title">{title}</div>}
          <div className="notification-message">{message}</div>
          {this.renderTimer()}
        </div>
      </div>
    );
  }

  render() {
    const {
      notification: {
        content,
        dismiss: { click }
      }
    } = this.props;
    const { parentStyle, onAnimationEnd, onTransitionEnd, touchEnabled } = this.state;

    return (
      <div
        ref={this.rootElementRef}
        onClick={click ? this.onClick : null}
        className="notification-parent"
        style={parentStyle}
        onAnimationEnd={onAnimationEnd}
        onTransitionEnd={onTransitionEnd}
        onTouchStart={touchEnabled ? this.onTouchStart : null}
        onTouchMove={touchEnabled ? this.onTouchMove : null}
        onTouchEnd={touchEnabled ? this.onTouchEnd : null}
      >
        {content ? this.renderCustomContent() : this.renderNotification()}
      </div>
    );
  }
}

export default Notification;
