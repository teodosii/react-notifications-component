import React from 'react';
import { store } from 'src';
import notification from 'samples/js/helpers/notification';
import { getContainer, getMessage, getTitle } from 'samples/js/helpers/randomize';
import { iNotification } from 'src/types/Notification';

export default function TypeExample() {
  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Type</h6>
        <div>
          <code className="white-code">Type</code> can be set from predefined values{' '}
          <code className="white-code">success</code>, <code className="white-code">default</code>,{' '}
          <code className="white-code">warning</code>, <code className="white-code">info</code>,{' '}
          <code className="white-code">danger</code> or custom to suit your needs
        </div>
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add('success')}
          >
            Success
          </button>{' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add('default')}
          >
            Default
          </button>{' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add('warning')}
          >
            Warning
          </button>{' '}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add('info')}>
            Info
          </button>{' '}
          <button type="button" className="btn btn-outline-secondary" onClick={() => add('danger')}>
            Danger
          </button>{' '}
          <button type="button" className="btn btn-primary" onClick={() => this.add('awesome')}>
            Custom
          </button>
        </div>
      </div>
    </div>
  );
}

function add(type: string) {
  const object: iNotification = {}
  return store.addNotification(
    Object.assign(object, notification, {
      type,
      title: getTitle(type),
      message: getMessage(type),
      container: getContainer()
    })
  );
}
