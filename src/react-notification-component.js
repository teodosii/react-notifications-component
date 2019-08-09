import React from "react";
import ReactNotification from "src/react-notification";
import PropTypes from "prop-types";
import store from './store';
import { isArray } from "src/utils";
import {
  INSERTION,
  NOTIFICATION_STAGE,
  REMOVAL,
  BREAKPOINT
} from "src/constants";
import {
  getNotificationsForEachContainer,
  getNotificationsForMobileView,
  setNotificationDefaults
} from "src/helpers";

// react-notifications-component theme
import "src/scss/notification.scss";

class ReactNotificationComponent extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    breakpoint: PropTypes.number,
    types: PropTypes.array,
    onNotificationRemoval: PropTypes.func
  }

  static defaultProps = {
    isMobile: true,
    breakpoint: BREAKPOINT
  }

  constructor(props) {
    super(props);

    this.state = {
      isMobile: props.isMobile,
      breakpoint: props.breakpoint,
      notifications: []
    };

    if (isArray(props.types)) {
      // check for custom types
      this.state.userDefinedTypes = props.types;
    }

    this.addNotification = this.addNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.onNotificationClick = this.onNotificationClick.bind(this);
    this.toggleRemoval = this.toggleRemoval.bind(this);
    this.toggleTimeoutRemoval = this.toggleTimeoutRemoval.bind(this);
    this.toggleTouchEnd = this.toggleTouchEnd.bind(this);
  }

  componentDidMount() {
    store.register({
      addNotification: this.addNotification,
      removeNotification: this.removeNotification
    });

    this.setState({ width: window.innerWidth });
    window.addEventListener("resize", () => this.handleResize());
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleResize() {
    this.setState((prevState) => ({
      width: window.innerWidth,
      notifications: prevState.notifications.map(notification => ({
        ...notification,
        resized: true
      }))
    }));
  }

  toggleTimeoutRemoval(notification) {
    const { SLIDING_ANIMATION_EXIT } = NOTIFICATION_STAGE;
    const { TIMEOUT } = REMOVAL;

    this.setState((prevState) => ({
      notifications: prevState.notifications.map(item => {
        if (item.id === notification.id) {
          item.stage = SLIDING_ANIMATION_EXIT;
          item.removedBy = TIMEOUT;
        }

        return item;
      })
    }));
  }

  addNotification(object) {
    const { userDefinedTypes } = this.state;
    const notification = setNotificationDefaults(object, userDefinedTypes);

    this.setState((prevState) => ({
      notifications:
        notification.insert === INSERTION.TOP
          ? [notification, ...prevState.notifications]
          : [...prevState.notifications, notification]
    }));

    return notification.id;
  }

  removeNotification(id) {
    const callback = () => requestAnimationFrame(() => {
      this.setState((prevState) => ({
        notifications: prevState.notifications.map(item => {
          if (item.id === id) {
            item.stage = NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT;
            item.removedBy = REMOVAL.API;
          }

          return item;
        })
      }));
    });

    this.setState((prevState) => ({
      notifications: prevState.notifications.map(item => {
        if (item.id === id) {
          item.stage = NOTIFICATION_STAGE.MANUAL_REMOVAL;
          item.removedBy = REMOVAL.API;
        }

        return item;
      })
    }), callback);
  }

  onNotificationClick(notification) {
    const { dismissable, dismissIcon } = notification;
    const dismissableByClick = dismissable && dismissable.click;
    if (!dismissableByClick && !dismissIcon) return;

    this.setState((prevState) => ({
      notifications: prevState.notifications.map(item => {
        if (item.id === notification.id) {
          item.stage = NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT;
          item.removedBy = REMOVAL.CLICK;
        }

        return item;
      })
    }));
  }

  toggleTouchEnd(notification) {
    const { TOUCH_SLIDING_ANIMATION_EXIT } = NOTIFICATION_STAGE;

    this.setState((prevState) => ({
      notifications: prevState.notifications.map(item => {
        if (item.id === notification.id) {
          item.stage = TOUCH_SLIDING_ANIMATION_EXIT;
          item.removedBy = REMOVAL.TOUCH;
        }

        return item;
      })
    }));
  }

  toggleRemoval(notification) {
    const { onNotificationRemoval } = this.props;

    const callback = () => {
      if (!onNotificationRemoval) return;
      onNotificationRemoval(notification.id, notification.removedBy);
    };

    this.setState((prevState) => ({
      notifications: prevState.notifications.filter(({ id }) => id !== notification.id)
    }), callback);
  }

  renderNotifications(notifications) {
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

  renderMobileNotifications() {
    const { notifications } = this.state;
    const mobileNotifications = getNotificationsForMobileView(notifications);
    const top = this.renderNotifications(mobileNotifications.top);
    const bottom = this.renderNotifications(mobileNotifications.bottom);

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

  renderScreenNotifications() {
    const { notifications } = this.state;
    const notificationsPerContainer = getNotificationsForEachContainer(notifications);
    const topLeft = this.renderNotifications(notificationsPerContainer.topLeft);
    const topRight = this.renderNotifications(notificationsPerContainer.topRight);
    const topCenter = this.renderNotifications(notificationsPerContainer.topCenter);
    const bottomLeft = this.renderNotifications(notificationsPerContainer.bottomLeft);
    const bottomRight = this.renderNotifications(notificationsPerContainer.bottomRight);
    const bottomCenter = this.renderNotifications(notificationsPerContainer.bottomCenter);

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

  render() {
    const { isMobile } = this.props;
    const { width, breakpoint } = this.state;

    if (isMobile && width <= breakpoint) {
      return this.renderMobileNotifications();
    }

    return this.renderScreenNotifications();
  }
}

export { ReactNotificationComponent, store };
