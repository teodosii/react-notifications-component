import React from "react";
import Highlight from "react-highlight";
import { usage } from "../../helpers/code";
import notification from "../../helpers/notification";

export default function UsageExample({ addNotification }) {
  const add = () => {
    addNotification(Object.assign({}, notification, {
      title: "Awesomeness",
      message: "Awesome Notifications!",
      type: "success",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    }));
  }

  return (
    <div className="row">
      <div className="col-lg-8 offset-lg-2 column col-md-10 offset-md-1 col-sm-12 heading">
        <h2 className="text-center">Usage</h2>
        <div className="usage-example">
          <Highlight>
            {usage}
          </Highlight>
        </div>
        <button className="btn btn-primary" onClick={add}>
          Add Awesome Notification
        </button>
      </div>
    </div>
  );
}