import React from "react";
import notification from "../../helpers/notification";

export default function InsertExample({ addNotification }) {
  const add = (insert) => {
    let object;

    if (insert === "top") {
      object = Object.assign({}, notification, { insert: "top" });
      return addNotification(object);
    } else {
      object = Object.assign({}, notification, { insert: "bottom" });
      return addNotification(object);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Insert</h6>
        <div className="alert alert-warning alert-transparent">
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