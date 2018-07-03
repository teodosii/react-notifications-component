import React from "react";
import notification from "../../helpers/notification";
import {
  getContainer,
  getMessage,
  getTitle
} from "../../helpers/randomize";

export default class TypeExample extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
  }

  add(type) {
    return this.props.addNotification(Object.assign({}, notification, {
      type,
      title: getTitle(type),
      message: getMessage(type),
      container: getContainer()
    }));
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
          <h6>Type</h6>
          <div>
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
            <button type="button" className="btn btn-primary" onClick={() => this.add("awesome")}>Custom</button>
          </div>
        </div>
      </div>
    );
  }
}