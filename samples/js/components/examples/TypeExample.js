import React from "react";
import notification from "../../helpers/notification";

export default class TypeExample extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
  }

  add(type) {
    const containers = [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right"
    ];

    const container = () => containers[Math.floor(Math.random() * 4) + 0];

    switch (type) {
      case "success":
        return this.props.addNotification(Object.assign({}, notification, {
          width: 250,
          type: "success",
          title: "Success",
          message: "All your data has been saved with success",
          container: container()
        }));
      case "default":
        return this.props.addNotification(Object.assign({}, notification, {
          width: 250,
          type: "default",
          title: "Meeting scheduled",
          message: "Your daily meeting has been scheduled automatically",
          container: container()
        }));
      case "warning":
        return this.props.addNotification(Object.assign({}, notification, {
          width: 250,
          type: "warning",
          title: "Warning",
          message: "Not saving data before 12AM might cause data corrupcy",
          container: container()
        }));
      case "info":
        return this.props.addNotification(Object.assign({}, notification, {
          width: 250,
          type: "info",
          title: "Reminder",
          message: "You have an appointment today at 4PM",
          container: container()
        }));
      case "danger":
        return this.props.addNotification(Object.assign({}, notification, {
          width: 250,
          type: "danger",
          title: "Error",
          message: "You have no rights for this action",
          container: container()
        }));
      case "custom":
        return this.props.addNotification(Object.assign({}, notification, {
          width: 250,
          type: "awesome",
          container: container()
        }));
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
          <h6>Type</h6>
          <div className="alert alert-warning alert-transparent">
            <code className="white-code">Type</code> can be set from predefined values {" "}
            <code className="white-code">success</code>, {" "}
            <code className="white-code">default</code>, {" "}
            <code className="white-code">warning</code>, {" "}
            <code className="white-code">info</code>, {" "}
            <code className="white-code">danger</code> or custom to suit your needs
        </div>
          <div>
            <button type="button" className="btn btn-outline-secondary" onClick={() => this.add("success")}>Success</button>{" "}
            <button type="button" className="btn btn-outline-secondary" onClick={() => this.add("default")}>Default</button>{" "}
            <button type="button" className="btn btn-outline-secondary" onClick={() => this.add("warning")}>Warning</button>{" "}
            <button type="button" className="btn btn-outline-secondary" onClick={() => this.add("info")}>Info</button>{" "}
            <button type="button" className="btn btn-outline-secondary" onClick={() => this.add("danger")}>Danger</button>{" "}
            <button type="button" className="btn btn-primary" onClick={() => this.add("custom")}>Custom</button>
          </div>
        </div>
      </div>
    );
  }
}