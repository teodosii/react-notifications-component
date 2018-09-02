import React from "react";
import notification from "helpers/notification";
import {
  getContainer,
  getType,
  getMessage
} from "helpers/randomize";

function AnimationInExample({ addNotification }) {
  const add = (htmlClasses) => {
    const type = getType();

    return addNotification(Object.assign({}, notification, {
      animationIn: htmlClasses,
      container: getContainer(),
      message: getMessage(type),
      type
    }));
  };

  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Animation Entrance</h6>
        <div>Entrance <code className="white-code">animation</code> can be customised by specifying CSS classes</div>
        <div>
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated bounceIn"])}>Bounce In</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated fadeIn"])}>Fade In</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated flipInX"])}>Flip In X</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated flipInY"])}>Flip In Y</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated zoomIn"])}>Zoom In</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated flash"])}>Flash</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated jackInTheBox"])}>Jack In The Box</button>
        </div>
      </div>
    </div>
  );
}

function AnimationOutExample({ addNotification }) {
  const add = (htmlClasses) => {
    const type = getType();

    return addNotification(Object.assign({}, notification, {
      slidingExit: { delay: 300 },
      animationOut: htmlClasses,
      container: getContainer(),
      message: getMessage(type),
      dismiss: null,
      type
    }));
  };

  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Animation Exit</h6>
        <div>Exit <code className="white-code">animation</code> can be customised by specifying CSS classes</div>
        <div>
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated bounceOut"])}>Bounce Out</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated fadeOut"])}>Fade Out</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated flipOutX"])}>Flip Out X</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated flipOutY"])}>Flip Out Y</button>{" "}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add(["animated zoomOut"])}>Zoom Out</button>{" "}
        </div>
      </div>
    </div>
  );
}

export default function AnimationWrapper({ addNotification }) {
  return (
    <div>
      <AnimationInExample addNotification={addNotification} />
      <AnimationOutExample addNotification={addNotification} />
    </div>
  );
}