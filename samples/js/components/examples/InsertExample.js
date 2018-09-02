import React from "react";
import notification from "helpers/notification";
import {
  getType,
  getMessage,
  getTitle
} from "helpers/randomize";

export default function InsertExample({ addNotification }) {
  const add = (insert) => {
    const type = getType();

    return addNotification(Object.assign({}, notification, {
      type,
      insert,
      message: getMessage(type),
      title: getTitle(type)
    }));
  };

  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Insert</h6>
        <div>
          Insertion in <code className="white-code">react-notifications</code> can be done either at the {" "}
          <code className="white-code">top</code> or at the {" "}
          <code className="white-code">bottom</code> of the container
        </div>
        <div>
          <button type="button" className="btn btn-outline-secondary" onClick={() => add("top")}>Top </button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add("bottom")}>Bottom</button>
        </div>
      </div>
    </div>
  );
}