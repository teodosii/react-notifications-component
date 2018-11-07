import React from "react";
import ReactNotification from "src/react-notification";
import {
  isArray,
  isNullOrUndefined
} from "src/utils";

import {
  INSERTION,
  NOTIFICATION_STAGE,
  REMOVAL
} from "src/constants";

import {
  getNotificationsForEachContainer,
  getNotificationsForMobileView,
  getNotificationOptions
} from "src/helpers";

// react-notifications-component theme
import "src/scss/notification.scss";

class ReactNotificationComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // option for responsiveness (defaults to true)
      isMobile: props.isMobile,
      // responsiveness breakpoint (defaults to 768)
      breakpoint: props.breakpoint,
      // notifications array data
      notifications: []
    };

    if (isNullOrUndefined(props.breakpoint)) {
      // set default breakpoint
      this.state.breakpoint = 768;
    }

    if (isNullOrUndefined(props.isMobile)) {
      // option defaults to true
      this.state.isMobile = true;
    }

    if (isArray(props.types)) {
      // check for custom types
      this.state.userDefinedTypes = props.types;
    }

    this.addNotification = this.addNotification.bind(this);
    this.onNotificationClick = this.onNotificationClick.bind(this);
    this.toggleRemoval = this.toggleRemoval.bind(this);
    this.toggleTimeoutRemoval = this.toggleTimeoutRemoval.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.renderReactNotifications = this.renderReactNotifications.bind(this);
    this.toggleTouchEnd = this.toggleTouchEnd.bind(this);
  }

  componentDidMount() {
    this.setState({
      width: window.innerWidth
    }, () => {
      // add listener for `resize` event
      window.addEventListener("resize", this.handleResize);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleResize() {
    this.setState({
      width: window.innerWidth,
      notifications: this.state.notifications.map(notification => {
        notification.resized = true;
        return notification;
      })
    });
  }

  toggleTimeoutRemoval(notification) {
    const { SLIDING_ANIMATION_EXIT } = NOTIFICATION_STAGE;
    const { TIMEOUT } = REMOVAL;

    this.setState({
      notifications: this.state.notifications.map(item => {
        if (item.id === notification.id) {
          // set stage flag
          item.stage = SLIDING_ANIMATION_EXIT;
          // set removal flag
          item.removedBy = TIMEOUT;
        }

        return item;
      })
    });
  }

  // API call
  addNotification(object) {
    const { notifications: data } = this.state;

    // call will throw exception if object does not match rules
    const notification = getNotificationOptions(
      object,
      // we need this to validate custom types if any
      this.state.userDefinedTypes
    );

    this.setState({
      notifications:
        notification.insert === INSERTION.TOP
          ? [notification, ...data]
          : [...data, notification]
    });

    return notification.id;
  }

  // API call
  removeNotification(id) {
    this.setState({
      notifications: this.state.notifications.map(item => {
        if (item.id === id) {
          // set stage flag
          item.stage = NOTIFICATION_STAGE.MANUAL_REMOVAL;
          // set removal flag
          item.removedBy = REMOVAL.API;
        }

        return item;
      })
    }, () => {
      requestAnimationFrame(() => {
        this.setState({
          notifications: this.state.notifications.map(item => {
            if (item.id === id) {
              // set stage flag
              item.stage = NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT;
              // set removal flag
              item.removedBy = REMOVAL.API;
            }

            return item;
          })
        });
      });
    });
  }

  onNotificationClick(notification) {
    const { dismissable, dismissIcon } = notification;
    const dismissByClick = dismissable && dismissable.click;

    if (dismissByClick || dismissIcon) {
      requestAnimationFrame(() => {
        this.setState({
          notifications: this.state.notifications.map(item => {
            if (item.id === notification.id) {
              // set stage flag
              item.stage = NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT;
              // set removal flag
              item.removedBy = REMOVAL.CLICK;
            }

            return item;
          })
        });
      });
    }
  }

  // called after a full swipe in order to remove notification from state
  toggleTouchEnd(notification) {
    const { TOUCH_SLIDING_ANIMATION_EXIT } = NOTIFICATION_STAGE;

    this.setState({
      notifications: this.state.notifications.map(item => {
        if (item.id === notification.id) {
          // set stage flag
          item.stage = TOUCH_SLIDING_ANIMATION_EXIT;
          // set removal flag
          item.removedBy = REMOVAL.TOUCH;
        }

        return item;
      })
    });
  }

  toggleRemoval(notification) {
    this.setState({
      notifications: this.state.notifications.filter(item => item.id !== notification.id)
    }, () => {
      if (this.props.onNotificationRemoval) {
        this.props.onNotificationRemoval(notification.id, notification.removedBy);
      }
    });
  }

  renderReactNotifications(notifications) {
    return notifications.map(notification => <ReactNotification
      key={notification.id}
      notification={notification}
      isFirstNotification={notifications.length === 1}
      onClickHandler={this.onNotificationClick}
      toggleRemoval={this.toggleRemoval}
      toggleTimeoutRemoval={this.toggleTimeoutRemoval}
      toggleTouchEnd={this.toggleTouchEnd}
    />);
  }

  render() {
    const {
      state,
      props
    } = this;

    if (props.isMobile && state.width <= state.breakpoint) {
      const mobileNotifications = getNotificationsForMobileView(state.notifications);
      const top = this.renderReactNotifications(mobileNotifications.top);
      const bottom = this.renderReactNotifications(mobileNotifications.bottom);

      return (
        <div className="react-notification-root">
          <div className="notification-container-mobile-top">
            {top}
          </div>
          <div className="notification-container-mobile-bottom">
            {bottom}
          </div>
        </div>
      );
    }

    const notificationsPerContainer = getNotificationsForEachContainer(state.notifications);
    const topLeft = this.renderReactNotifications(notificationsPerContainer.topLeft);
    const topRight = this.renderReactNotifications(notificationsPerContainer.topRight);
    const topCenter = this.renderReactNotifications(notificationsPerContainer.topCenter);
    const bottomLeft = this.renderReactNotifications(notificationsPerContainer.bottomLeft);
    const bottomRight = this.renderReactNotifications(notificationsPerContainer.bottomRight);
    const bottomCenter = this.renderReactNotifications(notificationsPerContainer.bottomCenter);

    return (
      <div className="react-notification-root">
        <div className="notification-container-top-left">
          {topLeft}
        </div>
        <div className="notification-container-top-right">
          {topRight}
        </div>
        <div className="notification-container-bottom-left">
          {bottomLeft}
        </div>
        <div className="notification-container-bottom-right">
          {bottomRight}
        </div>
        <div className="notification-container-top-center">
          {topCenter}
        </div>
        <div className="notification-container-bottom-center">
          {bottomCenter}
        </div>
      </div>
    );
  }
}

export default ReactNotificationComponent;
