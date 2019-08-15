import React from "react";
import ReactNotification from "src/react-notification";
import PropTypes from "prop-types";
import store from './store';
import { isArray } from "src/utils";
import {
  INSERTION,
  BREAKPOINT
} from "src/constants";
import {
  getNotificationsForEachContainer,
  getNotificationsForMobileView
} from "src/helpers";

// react-notifications-component theme
import "src/scss/notification.scss";

class ReactNotificationComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: props.isMobile,
      breakpoint: props.breakpoint,
      notifications: []
    };

    if (isArray(props.types)) {
      this.state.userDefinedTypes = props.types;
    }

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.updatePositions = this.updatePositions.bind(this);
  }

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

  componentDidMount() {
    store.register({
      addNotification: this.add,
      removeNotification: this.remove,
      userDefinedTypes: this.props.types
    });

    this.setState({ width: window.innerWidth });
    window.addEventListener("resize", () => this.handleResize());
  }

  componentWillUnmount() {}

  add(notification) {
    this.setState((prevState) => ({
      notifications:
        notification.insert === INSERTION.TOP
          ? [notification, ...prevState.notifications]
          : [...prevState.notifications, notification]
    }));

    return notification.id;
  }

  remove() {}

  toggleRemoval(notification) {
    const callback = () => {
      const { onNotificationRemoval } = this.props;
      if (onNotificationRemoval) {
        onNotificationRemoval(notification.id, notification.removedBy);
      }
    };

    this.setState(({ notifications }) => ({
      notifications: notifications.filter(({ id }) => id !== notification.id)
    }), callback);
  }

  onClick() {}

  renderNotifications(notifications) {
    return notifications.map(notification => <ReactNotification
      key={notification.id}
      notification={notification}
      onClick={this.onClick}
      count={notifications.length}
      toggleRemoval={this.toggleRemoval}
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
