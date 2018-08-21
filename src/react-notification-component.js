import React from "react";
import ReactNotification from "src/react-notification";
import {
  isArray,
  isNullOrUndefined
} from "src/utils";

import {
  INSERTION,
  NOTIFICATION_STAGE
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
      // window width
      width: window.innerWidth,
      // option for responsiveness (defaults to true)
      isMobile: props.isMobile,
      // responsiveness breakpoint (defaults to 768)
      breakpoint: props.width,
      // notifications array data
      notifications: []
    };

    if (isNullOrUndefined(props.width)) {
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
    // add listener for `resize` event
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleResize() {
    this.setState({
      width: window.innerWidth,
      notifications: this.state.notifications.map((notification) => {
        const object = notification;
        object.resized = true;

        return object;
      })
    });
  }

  toggleTimeoutRemoval(notification) {
    this.setState({
      notifications: this.state.notifications.map((item) => {
        const object = item;
        object.stage = object.id === notification.id
          ? NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT
          : object.stage;

        return object;
      })
    });
  }

  // part of API
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
          ? [notification].concat(data)
          : data.concat([notification])
    });

    return notification.id;
  }

  // part of API
  removeNotification(id) {
    this.setState({
      notifications: this.state.notifications.map((item) => {
        const object = item;
        object.stage = object.id === id
          ? NOTIFICATION_STAGE.REMOVAL
          : object.stage;

        return object;
      })
    }, () => {
      requestAnimationFrame(() => {
        this.setState({
          notifications: this.state.notifications.map((item) => {
            const object = item;
            object.stage = object.id === id
              ? NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT
              : object.stage;

            return object;
          })
        });
      });
    });
  }

  onNotificationClick(notification) {
    const hasDismissOption = notification.dismissable.click
      || notification.dismissable.icon;

    if (hasDismissOption) {
      requestAnimationFrame(() => {
        this.setState({
          notifications: this.state.notifications.map((item) => {
            const object = item;
            object.stage = object.id === notification.id
              ? NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT
              : object.stage;

            return object;
          })
        });
      });
    }
  }

  toggleTouchEnd(notification) {
    this.setState({
      notifications: this.state.notifications.map((item) => {
        const object = item;
        object.stage = object.id === notification.id
          ? NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT
          : object.stage;

        return object;
      })
    });
  }

  toggleRemoval(notification) {
    this.setState({
      notifications: this.state.notifications.filter(item => item.id !== notification.id)
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
            {top && top.length > 0}
          </div>
          <div className="notification-container-mobile-bottom">
            {bottom && bottom.length > 0}
          </div>
        </div>
      );
    }

    const notificationsPerContainer = getNotificationsForEachContainer(state.notifications);
    const topLeft = this.renderReactNotifications(notificationsPerContainer.topLeft);
    const topRight = this.renderReactNotifications(notificationsPerContainer.topRight);
    const bottomLeft = this.renderReactNotifications(notificationsPerContainer.bottomLeft);
    const bottomRight = this.renderReactNotifications(notificationsPerContainer.bottomRight);

    return (
      <div className="react-notification-root">
        <div className="notification-container-top-left">
          {topLeft && topLeft.length > 0}
        </div>
        <div className="notification-container-top-right">
          {topRight && topRight.length > 0}
        </div>
        <div className="notification-container-bottom-left">
          {bottomLeft && bottomLeft.length > 0}
        </div>
        <div className="notification-container-bottom-right">
          {bottomRight && bottomRight.length > 0}
        </div>
      </div>
    );
  }
}

export default ReactNotificationComponent;
