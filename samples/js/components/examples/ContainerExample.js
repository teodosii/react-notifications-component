import React from "react";
import notification from "../../helpers/notification";

export default class ContainerExample extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
  }

  add(container) {
    const { addNotification } = this.props;

    const types = [
      "success",
      "danger",
      "warning",
      "default",
      "info"
    ];

    const type = () => types[Math.floor(Math.random() * 5) + 0];

    switch (container) {
      case "top-left":
        return addNotification(Object.assign({}, notification, {
          width: 250,
          container: "top-left",
          type: type()
        }));
      case "top-right":
        return addNotification(Object.assign({}, notification, {
          width: 250,
          container: "top-right",
          type: type()
        }));
      case "bottom-left":
        return addNotification(Object.assign({}, notification, {
          width: 250,
          container: "bottom-left",
          type: type()
        }));
      case "bottom-right":
        return addNotification(Object.assign({}, notification, {
          width: 250,
          container: "bottom-right",
          type: type()
        }));
      default:
        throw new Error(`Container ${notification.container} is not valid.`);
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
          <h6>Container</h6>
          <div className="alert alert-warning alert-transparent">
            <code className="white-code">Container</code> can be set from predefined values {" "}
            <code className="white-code">top-left</code>, {" "}
            <code className="white-code">top-right</code>, {" "}
            <code className="white-code">bottom-left</code>, {" "}
            <code className="white-code">bottom-right</code> or <code className="white-code">custom</code> to suit your needs
          </div>
          <div className="alert alert-warning alert-small">
            <i className="fa fa-info-circle"></i>
            Try viewing notifications from a mobile device to see that notifications are <code className="white-code">responsive</code>
          </div>
          <div>
            <button type="button" className="btn btn-outline-secondary" onClick={() => this.add("top-left")}>Top Left</button>{" "}
            <button type="button" className="btn btn-outline-secondary" onClick={() => this.add("top-right")}>Top Right</button>{" "}
            <button type="button" className="btn btn-outline-secondary" onClick={() => this.add("bottom-left")}>Bottom Left</button>{" "}
            <button type="button" className="btn btn-outline-secondary" onClick={() => this.add("bottom-right")}>Bottom Right</button>{" "}
          </div>
        </div>
      </div>
    );
  }
}