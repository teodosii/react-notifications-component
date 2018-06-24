import React from "react";
import notification from "../../helpers/notification";

export function AnimationInExample({ addNotification }) {
  const add = (htmlClasses) => {
    return addNotification(Object.assign({}, notification, {
      animationIn: htmlClasses
    }));
  };

  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Animation Entrance</h6>
        <div className="alert alert-warning alert-transparent">
          Animations in <code className="white-code">react-notifications</code> are done using <code className="white-code">animate.css</code>
        </div>
        <div>
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated bounceIn"])}>Bounce In</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated fadeIn"])}>Fade In</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated flipInX"])}>Flip In X</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated zoomIn"])}>Zoom In</button>{" "}
        </div>
      </div>
    </div>
  );
}

export function AnimationOutExample({ addNotification }) {
  const add = (htmlClasses) => {
    return addNotification(Object.assign({}, notification, {
      animationOut: htmlClasses
    }));
  };

  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Animation Exit</h6>
        <div className="alert alert-warning alert-transparent">
          Animations in <code className="white-code">react-notifications</code> are done using <code className="white-code">animate.css</code>
        </div>
        <div>
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated bounceOut"])}>Bounce Out</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated fadeOut"])}>Fade Out</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated flipOutX"])}>Flip Out X</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated zoomOut"])}>Zoom Out</button>{" "}
        </div>
      </div>
    </div>
  );
}