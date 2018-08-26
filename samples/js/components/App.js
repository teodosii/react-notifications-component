import React from "react";
import ReactNotification from "rc-notifications/react-notification-component";
import Header from "./Header";
import Content from "./Content";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.instance = React.createRef();
    this.addNotification = this.addNotification.bind(this);
  }

  addNotification(notification) {
    return this.instance.current.addNotification(notification);
  }

  render() {
    return (
      <React.Fragment>
        <ReactNotification
          types={[{
            htmlClasses: ["notification-awesome"],
            name: "awesome"
          }]}
          ref={this.instance}
          isMobile={true}
        />
        <Header />
        <Content addNotification={this.addNotification} />
      </React.Fragment>
    );
  }
}