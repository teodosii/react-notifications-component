import React from 'react';
import PropTypes from 'prop-types';
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

    const state = {
      parentStyle: { height: 0, overflow: 'hidden' },
      childStyle: { opacity: 0 },
      htmlClassList: getHtmlClassesForType(props.notification),
      onTransitionEnd: null,
      touchEnabled: true
    };

    this.state = state;
  }

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    toggleRemoval: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired
  }

  componentDidMount() {
    const { notification, count } = this.props;
    const willSlide = shouldNotificationHaveSliding(notification, count);

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
      }
    }, callback);
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

  componentWillUnmount() {}

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

  renderCustomX(dismissIcon) {
    return (
      <div
        className={dismissIcon.className}
        onClick={this.onNotificationClick}
      >
        {dismissIcon.content}
      </div>
    );
  }

  renderBasicX() {
    return (
      <div
        className="notification-close"
        onClick={this.onNotificationClick}
      >
        <span>&times;</span>
      </div>
    );
  }

  renderCustomContent() {
    const { notification } = this.props;
    const { onTransitionEnd, parentStyle, childStyle, htmlClassList } = this.state;

    return (
      <div
        ref={this.rootElementRef}
        onClick={this.onClick}
        style={parentStyle}
        onTransitionEnd={onTransitionEnd}
        className='n-parent'
      >
        <div
          className={`${[...htmlClassList, 'n-child'].join(' ')}`}
          style={childStyle}
        >
          {notification.content}
        </div>
      </div>
    );
  }

  renderNotification() {
    const { notification: { title, message, dismissIcon } } = this.props;
    const {
      onTransitionEnd,
      parentStyle,
      childStyle,
      htmlClassList,
      touchEnabled
    } = this.state;

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
        <div
          className={`${[...htmlClassList, 'n-child'].join(' ')}`}
          style={childStyle}
        >
          <div className="notification-content">
            { dismissIcon
              ? this.renderCustomX()
              : this.renderBasicX()
            }
            { title &&
              <p className="notification-title">
                {title}
              </p>
            }
            { <p className="notification-message">
                {message}
              </p>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { notification: { content } } = this.props;

    return content
      ? this.renderCustomContent()
      : this.renderNotification();
  }
}
