import React from "react";
import { ReactNotificationComponent as ReactNotification, store } from "rc-notifications/react-notification-component";
import Header from "components/Header";
import Content from "components/Content";
import GithubCorner from "react-github-corner";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: []
    };

    this.addNotification = this.addNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  addNotification(notification) {
    const id = store.addNotification(notification);
    return this.setState({
      notifications: [
        ...this.state.notifications,
        id
      ]
    });
  }

  removeNotification() {
    if (this.state.notifications.length === 0) return;

    const { notifications } = this.state;
    const id = notifications[notifications.length - 1];

    // trigger notification removal
    store.removeNotification(id);

    // remove notification from state
    this.setState({
      notifications: notifications.filter(item => item !== id)
    });
  }

  render() {
    return (
      <React.Fragment>
        <ReactNotification
          types={[{
            htmlClasses: ["notification-awesome"],
            name: "awesome"
          }]}
          isMobile={true}
        />
        <Header />
        <Content
          removeNotification={this.removeNotification}
          addNotification={this.addNotification} />
        <GithubCorner
          target="_blank"
          size={125}
          href="https://github.com/teodosii/react-notifications-component" />
      </React.Fragment>
    );
  }
}