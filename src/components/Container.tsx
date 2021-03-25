import PropTypes from 'prop-types';
import React from 'react';
import ReactNotification from 'src/components/Notification';
import 'src/scss/notification.scss';
import store from 'src/store';
import { DEFAULT_CONTAINER_VALUES as DCV } from 'src/utils/constants';
import { iNotification, iNotificationCustomType } from 'src/types/Notification';
import {
  getNotificationsForEachContainer,
  getNotificationsForMobileView,
  isNull
} from 'src/utils/helpers';

interface iContainerProps {
  isMobile?: boolean;
  breakpoint?: number;
  types?: iNotificationCustomType[];
  defaultNotificationWidth?: number;
}

interface iContainerState {
  isMobile: boolean;
  breakpoint: number;
  notifications: iNotification[];
  windowWidth: number;
}

class Container extends React.Component<iContainerProps, iContainerState> {
  constructor(props: iContainerProps) {
    super(props);

    this.state = {
      isMobile: isNull(props.isMobile) ? DCV.isMobile : props.isMobile,
      breakpoint: isNull(props.breakpoint) ? DCV.breakpoint : props.breakpoint,
      notifications: [],
      windowWidth: undefined
    };
  }

  componentDidMount() {
    const { types, defaultNotificationWidth } = this.props;

    store.register({
      addNotification: this.add,
      removeNotification: this.remove,
      removeAllNotifications: this.removeAllNotifications,
      defaultNotificationWidth: defaultNotificationWidth || DCV.defaultNotificationWidth,
      types
    });

    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  add = (notification: iNotification) => {
    this.setState(({ notifications }) => {
      const nextNotifications = [...notifications];
      const i = nextNotifications.findIndex(({ id }) => id === notification.id);

      if (i > -1) {
        nextNotifications[i] = notification;

        return {
          notifications: nextNotifications
        }
      }

      return {
        notifications:
          notification.insert === 'top'
            ? [notification, ...nextNotifications]
            : [...nextNotifications, notification]
      }
    });

    return notification.id;
  };

  remove = (id: string) => {
    this.setState(({ notifications }) => ({
      notifications: notifications.map((notification) => {
        if (notification.id === id) {
          notification.hasBeenRemoved = true;
        }

        return notification;
      })
    }));
  };

  removeAllNotifications = () => {
    this.setState({
      notifications: this.state.notifications.map((notification) => ({
        ...notification,
        hasBeenRemoved: true
      }))
    });
  };

  toggleRemoval = (id: string, callback: () => void) => {
    this.setState(
      ({ notifications }) => ({
        notifications: notifications.filter(({ id: nId }) => nId !== id)
      }),
      callback
    );
  };

  renderNotifications(notifications: iNotification[], isMobile: boolean) {
    return notifications.map((notification) => (
      <ReactNotification
        id={notification.id}
        key={notification.id}
        isMobile={isMobile}
        defaultNotificationWidth={this.props.defaultNotificationWidth}
        notification={notification}
        toggleRemoval={this.toggleRemoval}
        notificationsCount={notifications.length}
        hasBeenRemoved={notification.hasBeenRemoved}
      />
    ));
  }

  renderMobileNotifications(props) {
    const { className, id } = props;
    const { notifications } = this.state;
    const mobileNotifications = getNotificationsForMobileView(notifications);
    const top = this.renderNotifications(mobileNotifications.top, true);
    const bottom = this.renderNotifications(mobileNotifications.bottom, true);

    return (
      <div id={id} key="mobile" className={`notifications-component ${className || ''}`}>
        <div className="notification-container--mobile-top">{top}</div>
        <div className="notification-container--mobile-bottom">{bottom}</div>
      </div>
    );
  }

  renderScreenNotifications(props) {
    const { className, id } = props;
    const { notifications } = this.state;
    const items = getNotificationsForEachContainer(notifications);
    const topFull = this.renderNotifications(items.topFull, false);
    const bottomFull = this.renderNotifications(items.bottomFull, false);
    const topLeft = this.renderNotifications(items.topLeft, false);
    const topRight = this.renderNotifications(items.topRight, false);
    const topCenter = this.renderNotifications(items.topCenter, false);
    const bottomLeft = this.renderNotifications(items.bottomLeft, false);
    const bottomRight = this.renderNotifications(items.bottomRight, false);
    const bottomCenter = this.renderNotifications(items.bottomCenter, false);
    const center = this.renderNotifications(items.center, false);

    return (
      <div id={id} key="screen" className={`notifications-component ${className || ''}`}>
        <div className="notification-container--top-full">{topFull}</div>
        <div className="notification-container--bottom-full">{bottomFull}</div>
        <div className="notification-container--top-left">{topLeft}</div>
        <div className="notification-container--top-right">{topRight}</div>
        <div className="notification-container--bottom-left">{bottomLeft}</div>
        <div className="notification-container--bottom-right">{bottomRight}</div>
        <div className="notification-container--top-center">{topCenter}</div>
        <div className="notification-container--center">
          <div className="flex-center">{center}</div>
        </div>
        <div className="notification-container--bottom-center">{bottomCenter}</div>
      </div>
    );
  }

  render() {
    const { isMobile } = this.props;
    const { windowWidth, breakpoint } = this.state;

    if (isMobile && windowWidth <= breakpoint) {
      return this.renderMobileNotifications(this.props);
    }

    return this.renderScreenNotifications(this.props);
  }
}

export default Container;
