import React from 'react';
import notification from 'samples/js/helpers/notification';
import { getContainer, getMessage, getType } from 'samples/js/helpers/randomize';
import { store } from 'src';
import { iNotification } from 'src/components/Notification';

function AnimationInExample() {
  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Animation Entrance</h6>
        <div>
          Entrance <code className="white-code">animation</code> can be customised by specifying CSS
          classes
        </div>
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animated bounceIn'])}
          >
            Bounce In
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animated fadeIn'])}
          >
            Fade In
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animated flipInX'])}
          >
            Flip In X
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animated flipInY'])}
          >
            Flip In Y
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animated zoomIn'])}
          >
            Zoom In
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animated flash'])}
          >
            Flash
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animated jackInTheBox'])}
          >
            Jack In The Box
          </button>
        </div>
      </div>
    </div>
  );
}

function AnimationOutExample() {
  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Animation Exit</h6>
        <div>
          Exit <code className="white-code">animation</code> can be customised by specifying CSS
          classes
        </div>
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(false, ['animated bounceOut'])}
          >
            Bounce Out
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(false, ['animated fadeOut'])}
          >
            Fade Out
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(false, ['animated flipOutX'])}
          >
            Flip Out X
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(false, ['animated flipOutY'])}
          >
            Flip Out Y
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(false, ['animated zoomOut'])}
          >
            Zoom Out
          </button>
          {' '}
        </div>
      </div>
    </div>
  );
}

function add(isEntranceAnimation: boolean, htmlClasses: string[]) {
  const type = getType();
  const object: iNotification = {};

  if (isEntranceAnimation) {
    return store.addNotification(
      Object.assign(object, notification, {
        animationIn: htmlClasses,
        container: getContainer(),
        message: getMessage(type),
        type
      })
    );
  }

  return store.addNotification(
    Object.assign(object, notification, {
      slidingExit: { delay: 300 },
      animationOut: htmlClasses,
      container: getContainer(),
      message: getMessage(type),
      type
    })
  );
}

export default function AnimationWrapper() {
  return (
    <div>
      <AnimationInExample/>
      <AnimationOutExample/>
    </div>
  );
}
