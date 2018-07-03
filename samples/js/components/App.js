import React from "react";
import ReactNotification from "react-notifications-component";
import Header from "./Header";
import Content from "./Content";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.addNotification = this.addNotification.bind(this);
  }

  addNotification(notification) {
    return this.instance.addNotification(notification);
  }

  render() {
    return (
      <React.Fragment>
        <ReactNotification
          types={[{
            htmlClasses: ["notification-awesome"],
            name: "awesome"
          }]}
          ref={input => this.instance = input}
          isMobile={true}
        />
        <Header />
        <Content addNotification={this.addNotification} />
      </React.Fragment>
    );
  }
}