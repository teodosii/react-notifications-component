import React from 'react';
import notification from 'samples/js/helpers/notification';
import { getMessage, getTitle, getType } from 'samples/js/helpers/randomize';
import { store } from 'src';
import { iNotification } from 'src/types/Notification';

export default function ContainerExample() {
  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Container</h6>
        <div>
          <code className="white-code">Container</code> can be set from predefined values{' '}
          <code className="white-code">top-left</code>,{' '}
          <code className="white-code">top-right</code>,{' '}
          <code className="white-code">top-center</code>,{' '}
          <code className="white-code">bottom-left</code>,{' '}
          <code className="white-code">bottom-right</code>,{' '}
          <code className="white-code">bottom-center</code>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add('top-left')}
          >
            Top Left
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add('top-right')}
          >
            Top Right
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add('top-center')}
          >
            Top Center
          </button>
          {' '}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add('center')}>
            Center
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add('bottom-left')}
          >
            Bottom Left
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add('bottom-right')}
          >
            Bottom Right
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add('bottom-center')}
          >
            Bottom Center
          </button>
          {' '}
        </div>
      </div>
    </div>
  );
}

function add(container: string): string {
  const type = getType();
  const object: iNotification = {};

  return store.addNotification(Object.assign(object, notification, {
    title: getTitle(type),
    message: getMessage(type),
    container,
    type
  }));
}
