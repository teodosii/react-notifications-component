import PropTypes from 'prop-types';
import React from 'react';
import ReactNotification from 'src/components/Notification';
import 'src/scss/notification.scss';
import store from 'src/store';
import { iNotification, iNotificationCustomType } from 'src/types/Notification';
import { getNotificationsForEachContainer, getNotificationsForMobileView } from 'src/utils/helpers';

interface iContainerProps {
  isMobile: boolean;
  breakpoint: number;
  types: iNotificationCustomType[];
}

interface iContainerState {
  isMobile: boolean;
  breakpoint: number;
  notifications: iNotification[];
  width: number;
}

const defaultProps = {
  isMobile: true,
  breakpoint: 768
};

const propTypes = {
  isMobile: PropTypes.bool,
  breakpoint: PropTypes.number,
  types: PropTypes.array
};

class Container extends React.Component<iContainerProps, iContainerState> {
  constructor(props: iContainerProps) {
    super(props);

    this.state = {
      isMobile: props.isMobile,
      breakpoint: props.breakpoint,
      notifications: [],
      width: undefined
    };

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.toggleRemoval = this.toggleRemoval.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  static propTypes = propTypes;
  static defaultProps = defaultProps;

  componentDidMount() {
    const { types } = this.props;

    store.register({
                     addNotification: this.add,
                     removeNotification: this.remove,
                     types
                   });

    this.setState({ width: window.innerWidth });
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ width: window.innerWidth });
  }

  add(notification: iNotification) {
    this.setState(({ notifications }) => ({
      notifications:
        notification.insert === 'top'
        ? [notification, ...notifications]
        : [...notifications, notification]
    }));

    return notification.id;
  }

  remove(id: string) {
    this.setState(({ notifications }) => ({
      notifications: notifications.map((notification) => {
        if (notification.id === id) {
          notification.removed = true;
        }

        return notification;
      })
    }));
  }

  toggleRemoval(id: string, callback: () => void) {
    this.setState(
      ({ notifications }) => ({
        notifications: notifications.filter(({ id: nId }) => nId !== id)
      }),
      callback
    );
  }

  renderNotifications(notifications: iNotification[]) {
    return notifications.map((notification) => (
      <ReactNotification
        id={notification.id}
        key={notification.id}
        notification={notification}
        toggleRemoval={this.toggleRemoval}
        count={notifications.length}
        removed={notification.removed}
      />
    ));
  }

  renderMobileNotifications(props) {
    const { className, id } = props;
    const { notifications } = this.state;
    const mobileNotifications = getNotificationsForMobileView(notifications);
    const top = this.renderNotifications(mobileNotifications.top);
    const bottom = this.renderNotifications(mobileNotifications.bottom);

    return (
      <div id={id} key="mobile" className={`react-notification-root ${className || ''}`}>
        <div className="notification-container-mobile-top">{top}</div>
        <div className="notification-container-mobile-bottom">{bottom}</div>
      </div>
    );
  }

  renderScreenNotifications(props) {
    const { className, id } = props;
    const { notifications } = this.state;
    const items = getNotificationsForEachContainer(notifications);
    const topLeft = this.renderNotifications(items.topLeft);
    const topRight = this.renderNotifications(items.topRight);
    const topCenter = this.renderNotifications(items.topCenter);
    const bottomLeft = this.renderNotifications(items.bottomLeft);
    const bottomRight = this.renderNotifications(items.bottomRight);
    const bottomCenter = this.renderNotifications(items.bottomCenter);
    const center = this.renderNotifications(items.center);

    return (
      <div id={id} key="screen" className={`react-notification-root ${className || ''}`}>
        <div className="notification-container-top-left">{topLeft}</div>
        <div className="notification-container-top-right">{topRight}</div>
        <div className="notification-container-bottom-left">{bottomLeft}</div>
        <div className="notification-container-bottom-right">{bottomRight}</div>
        <div className="notification-container-top-center">{topCenter}</div>
        <div className="notification-container-center">
          <div className="center-inner">{center}</div>
        </div>
        <div className="notification-container-bottom-center">{bottomCenter}</div>
      </div>
    );
  }

  render() {
    const { isMobile } = this.props;
    const { width, breakpoint } = this.state;

    if (isMobile && width <= breakpoint) {
      return this.renderMobileNotifications(this.props);
    }

    return this.renderScreenNotifications(this.props);
  }
}

export default Container;
