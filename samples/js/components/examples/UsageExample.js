import React from "react";
import Highlight from "react-highlight";
import { usage } from "../../helpers/code";
import notification from "../../helpers/notification";
import notificationObject from "../../../../tests/utils/notification.mock";

export default function UsageExample({ addNotification }) {
  return (
    <div className="row">
      <div className="col-lg-8 offset-lg-2 column col-md-10 offset-md-1 col-sm-12 heading">
        <h2 className="text-center">Usage</h2>
        <div className="usage-example">
          <Highlight>
            {usage}
          </Highlight>
        </div>
      </div>
    </div>
  );
}