import React from 'react'
import { iNotificationProps, iNotificationState, iNotificationParentStyle } from 'src/typings'
import {
  getHtmlClassesForType,
  getTransition,
  hasFullySwiped,
  shouldNotificationHaveSliding
} from 'src/utils/helpers'
import Timer from 'src/utils/timer'
import { NOTIFICATION_REMOVAL_SOURCE } from 'src/utils/enums'

export { Notification }

class Notification extends React.Component<iNotificationProps, iNotificationState> {
  constructor(props: iNotificationProps) {
    super(props)
    this.rootElementRef = React.createRef()

    const { defaultNotificationWidth, notification, isMobile } = props
    const { width } = notification

    this.state = {
      parentStyle: {
        height: `0px`,
        overflow: 'hidden',
        width: `${width ? width : defaultNotificationWidth}px`
      },
      htmlClassList: getHtmlClassesForType(notification),
      animationPlayState: 'running',
      touchEnabled: true
    }

    if (isMobile) {
      this.state.parentStyle.width = '100%'
    }
  }

  private readonly rootElementRef: React.RefObject<HTMLDivElement>
  private timer: Timer

  componentWillUnmount() {
    if (this.timer) {
      this.timer.clear()
    }
  }

  componentDidMount() {
    const { notification, notificationsCount } = this.props
    const {
      dismiss: { duration, onScreen }
    } = notification
    const willSlide = shouldNotificationHaveSliding(notification, notificationsCount)
    const { scrollHeight } = this.rootElementRef.current

    const onTransitionEnd = () => {
      if (!duration || onScreen || this.timer) return
      const callback = () => this.removeNotification(NOTIFICATION_REMOVAL_SOURCE.TIMEOUT)
      this.timer = new Timer(callback, duration)
    }

    const callback = () => {
      requestAnimationFrame(() => {
        this.setState((prevState) => ({
          htmlClassList: [...notification.animationIn, ...prevState.htmlClassList]
        }))
      })
    }

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
    )
  }

  componentDidUpdate(prevProps: iNotificationProps) {
    if (this.props.hasBeenRemoved && !prevProps.hasBeenRemoved) {
      this.removeNotification(NOTIFICATION_REMOVAL_SOURCE.MANUAL)
    }

    if (prevProps !== this.props && !this.props.hasBeenRemoved) {
      const { container } = this.props.notification
      const { scrollHeight } = this.rootElementRef.current.children[0]

      this.setState(({ parentStyle }) => ({
        parentStyle: {
          ...parentStyle,
          height: `${scrollHeight + (container.endsWith('full') ? 0 : 15)}px`
        }
      }))
    }
  }

  removeNotification(removalFlag: string) {
    const { notification, toggleRemoval } = this.props
    const {
      id,
      onRemoval,
      dismiss: { waitForAnimation }
    } = notification

    const htmlClassList = [...notification.animationOut, ...getHtmlClassesForType(notification)]
    const onTransitionEnd = () => toggleRemoval(id, () => onRemoval(id, removalFlag))
    const parentStyle: iNotificationParentStyle = {
      height: `0px`,
      overflow: 'hidden',
      transition: getTransition(notification.slidingExit, 'height')
    }

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
          })
        }
      }))
    }

    return this.setState(({ parentStyle: { width } }) => ({
      parentStyle: {
        width,
        ...parentStyle
      },
      onTransitionEnd,
      htmlClassList
    }))
  }

  onClick = () => {
    const {
      notification: { dismiss }
    } = this.props
    if (dismiss.click || dismiss.showIcon) {
      this.removeNotification(NOTIFICATION_REMOVAL_SOURCE.CLICK)
    }
  }

  onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const { pageX } = event.touches[0]

    this.setState(({ parentStyle }) => ({
      startX: pageX,
      currentX: pageX,
      parentStyle: {
        ...parentStyle,
        position: 'relative'
      }
    }))
  }

  onTouchMove = (event: React.TouchEvent) => {
    const { pageX } = event.touches[0]
    const { startX } = this.state
    const {
      toggleRemoval,
      notification: {
        id,
        onRemoval,
        slidingExit,
        touchSlidingExit: { swipe, fade }
      }
    } = this.props

    const distance = pageX - startX
    const { offsetWidth: width } = this.rootElementRef.current
    const swipeTo = window.innerWidth + width
    const left = `${pageX - startX >= 0 ? swipeTo : -swipeTo}px`

    if (hasFullySwiped(distance, width)) {
      const t1 = getTransition(swipe, 'left')
      const t2 = getTransition(fade, 'opacity')
      const onTransitionEnd = () => {
        toggleRemoval(id, () => onRemoval(id, NOTIFICATION_REMOVAL_SOURCE.TOUCH))
      }

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
              overflow: 'hidden',
              transition: getTransition(slidingExit, 'height')
            },
            onTransitionEnd
          }))
        }
      }))
    }

    return this.setState(({ parentStyle }) => ({
      currentX: pageX,
      parentStyle: {
        ...parentStyle,
        left: `${0 + distance}px`
      }
    }))
  }

  onTouchEnd = () => {
    const {
      notification: { touchRevert }
    } = this.props

    this.setState(({ parentStyle }) => ({
      parentStyle: {
        ...parentStyle,
        left: 0,
        transition: getTransition(touchRevert, 'left')
      }
    }))
  }

  onMouseEnter = () => {
    if (this.timer) {
      this.timer.pause()
    } else {
      this.setState({ animationPlayState: 'paused' })
    }
  }

  onMouseLeave = () => {
    if (this.timer) {
      this.timer.resume()
    } else {
      this.setState({ animationPlayState: 'running' })
    }
  }

  renderTimer() {
    const {
      notification: { dismiss }
    } = this.props
    const { duration, onScreen } = dismiss
    const { animationPlayState } = this.state

    if (!duration || !onScreen) {
      return
    }

    const style = {
      animationName: 'timer',
      animationDuration: `${duration}ms`,
      animationTimingFunction: 'linear',
      animationFillMode: 'forwards',
      animationDelay: `0`,
      animationPlayState
    }

    const onAnimationEnd = () => this.removeNotification(NOTIFICATION_REMOVAL_SOURCE.TIMEOUT)
    return (
      <div className="rnc__notification-timer">
        <div
          className="rnc__notification-timer-filler"
          onAnimationEnd={onAnimationEnd}
          style={style}
        ></div>
      </div>
    )
  }

  renderCustomContent() {
    const { htmlClassList } = this.state
    const {
      notification: {
        id,
        content: CustomContent,
        dismiss: { duration, pauseOnHover }
      }
    } = this.props

    const hasMouseEvents = duration > 0 && pauseOnHover

    return (
      <div
        className={`${[...htmlClassList].join(' ')}`}
        onMouseEnter={hasMouseEvents ? this.onMouseEnter : null}
        onMouseLeave={hasMouseEvents ? this.onMouseLeave : null}
      >
        {React.isValidElement(CustomContent) ? CustomContent : <CustomContent {...{ id, notificationConfig: {...this.props.notification} }} />}
      </div>
    )
  }

  renderNotification() {
    const {
      notification: {
        title,
        message,
        dismiss: { showIcon, duration, pauseOnHover }
      }
    } = this.props
    const { htmlClassList } = this.state
    const hasMouseEvents = duration > 0 && pauseOnHover

    return (
      <div
        className={`${[...htmlClassList].join(' ')}`}
        onMouseEnter={hasMouseEvents ? this.onMouseEnter : null}
        onMouseLeave={hasMouseEvents ? this.onMouseLeave : null}
      >
        <div className="rnc__notification-content">
          {showIcon && <div className="rnc__notification-close-mark" onClick={this.onClick}></div>}
          {title && <div className="rnc__notification-title">{title}</div>}
          <div className="rnc__notification-message">{message}</div>
          {this.renderTimer()}
        </div>
      </div>
    )
  }

  render() {
    const {
      notification: {
        content,
        dismiss: { click }
      }
    } = this.props
    const { parentStyle, onAnimationEnd, onTransitionEnd, touchEnabled } = this.state

    return (
      <div
        ref={this.rootElementRef}
        onClick={click ? this.onClick : null}
        style={parentStyle}
        className="rnc__notification"
        onAnimationEnd={onAnimationEnd}
        onTransitionEnd={onTransitionEnd}
        onTouchStart={touchEnabled ? this.onTouchStart : null}
        onTouchMove={touchEnabled ? this.onTouchMove : null}
        onTouchEnd={touchEnabled ? this.onTouchEnd : null}
      >
        {content ? this.renderCustomContent() : this.renderNotification()}
      </div>
    )
  }
}
