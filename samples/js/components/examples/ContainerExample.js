import React from "react";
import notification from "../../helpers/notification";
import {
  getType,
  getMessage,
  getTitle
} from "../../helpers/randomize";

export default class ContainerExample extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
  }

  add(container) {
    const { addNotification } = this.props;
    const type = getType();

    return addNotification(Object.assign({}, notification, {
      title: getTitle(type),
      message: getMessage(type),
      container,
      type
    }));
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
          <h6>Container</h6>
          <div>
            <code className="white-code">Container</code> can be set from predefined values {" "}
            <code className="white-code">top-left</code>, {" "}
            <code className="white-code">top-right</code>, {" "}
            <code className="white-code">bottom-left</code>, {" "}
            <code className="white-code">bottom-right</code> or <code className="white-code">custom</code> to suit your needs
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