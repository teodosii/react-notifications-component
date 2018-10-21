import React from "react";
import ReactNotification from "rc-notifications/react-notification-component";
import Header from "components/Header";
import Content from "components/Content";
import GithubCorner from "react-github-corner";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: []
    };

    this.instance = React.createRef();
    this.addNotification = this.addNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);

    // this.onNotificationRemoval = this.onNotificationRemoval.bind(this);
  }

  addNotification(notification) {
    const id = this.instance.current.addNotification(notification);

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
    this.instance.current.removeNotification(id);

    // remove notification from state
    this.setState({
      notifications: notifications.filter(item => item !== id)
    });
  }

  render() {
    return (
      <React.Fragment>
        <ReactNotification
          // onNotificationRemoval={this.onNotificationRemoval}
          types={[{
            htmlClasses: ["notification-awesome"],
            name: "awesome"
          }]}
          ref={this.instance}
          isMobile={true}
        />
        <Header />
        <Content
          removeNotification={this.removeNotification}
          addNotification={this.addNotification} />
        <GithubCorner
          size={125}
          href="https://github.com/teodosii/react-notifications-component" />
      </React.Fragment>
    );
  }
}