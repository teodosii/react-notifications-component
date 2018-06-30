import React from "react";
import ReactNotification from "./react-notification";
import { isArray } from "./utils";
import {
  getNotificationsForEachContainer,
  getNotificationsForMobileView,
  getNotificationOptions
} from "./helpers";

import {
  INSERTION,
  NOTIFICATION_STAGE
} from "./constants";

class ReactNotificationComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // window width
      width: window.innerWidth,
      // notifications array data
      notifications: []
    };

    if (isArray(props.types)) {
      // check for custom types
      this.state.userDefinedTypes = props.types;
    }

    // bind methods to `this`
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
        object.stage = object.id === notification.id ?
          NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT :
          object.stage;

        return object;
      })
    });
  }

  addNotification(object) {
    // call will throw exception if object does not match rules
    const notification = getNotificationOptions(
      object,
      // we need this to validate custom types if any
      this.state.userDefinedTypes
    );

    const notifications =
      notification.insert.toLowerCase() === INSERTION.TOP ?
        [notification].concat(this.state.notifications) :
        this.state.notifications.concat([notification]);

    this.setState({ notifications });
    return notification.id;
  }

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
    const hasDismissOption =
      notification.dismissable.click ||
      notification.dismissable.icon;

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
    const { state, props } = this;

    const width = props.width === undefined ? 768 : props.width;
    const isMobileView = state.width <= width;

    if (props.isMobile && isMobileView) {
      const mobileNotifications = getNotificationsForMobileView(state.notifications);
      const top = this.renderReactNotifications(mobileNotifications.top);
      const bottom = this.renderReactNotifications(mobileNotifications.bottom);

      return (
        <div className="react-notification-root">
          <div className="notification-container-mobile-top">
            {top.length > 0 && top}
          </div>
          <div className="notification-container-mobile-bottom">
            {bottom.length > 0 && bottom}
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
          {topLeft.length > 0 && topLeft}
        </div>
        <div className="notification-container-top-right">
          {topRight.length > 0 && topRight}
        </div>
        <div className="notification-container-bottom-left">
          {bottomLeft.length > 0 && bottomLeft}
        </div>
        <div className="notification-container-bottom-right">
          {bottomRight.length > 0 && bottomRight}
        </div>
      </div>
    );
  }
}

export default ReactNotificationComponent;
