import React, { useEffect, useState } from 'react'
import notification from 'samples/js/helpers/notification'
import reactImage from 'samples/images/react.png'
import { getContainer } from 'samples/js/helpers/randomize'
import { store } from 'src'
import { iNotification } from 'src/components/Notification'

export default function CustomContentExample() {
  const [cachedImage] = useState(new Image())

  useEffect(() => {
    cachedImage.src = reactImage
  })

  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
        <h6>Custom Content</h6>
        <div>
          With <code className="white-code">react-notifications-component</code> {"notification's"}{' '}
          content can be customised to suit your needs.
        </div>
        <div>
          <button className="btn btn-outline-secondary" onClick={() => add(cachedImage)}>
            Custom Image Content
          </button>
          <div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => addCustomIcon('success', 'fa fa-check-circle')}
            >
              Success with Icon
            </button>{' '}
            <button
              className="btn btn-outline-secondary"
              onClick={() => addCustomIcon('danger', 'fa fa-exclamation-circle')}
            >
              Danger with Icon
            </button>{' '}
            <button
              className="btn btn-outline-secondary"
              onClick={() => addCustomIcon('warning', 'fa fa-exclamation-triangle')}
            >
              Warning with Icon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function add(cachedImage: HTMLImageElement): void {
  const object: iNotification = {}

  store.addNotification(
    Object.assign(object, notification, {
      width: 325,
      container: getContainer(),
      content: () => (
        <div className="custom-image-content">
          <img src={cachedImage.src} alt="" />
        </div>
      )
    })
  )
}

function addCustomIcon(type: string, iconClassName: string): void {
  let message: string
  if (type === 'success') {
    message = 'Your agenda has been successfully synced'
  } else if (type === 'warning') {
    message = 'Warning! All your data will be lost if you proceed'
  } else if (type === 'danger') {
    message = 'Error! You have no update rights'
  }

  const object: iNotification = {}

  store.addNotification(
    Object.assign(object, notification, {
      width: 275,
      container: getContainer(),
      content: (
        <div className={`notification__custom--${type}`}>
          <div className="notification__custom-icon">
            <i className={iconClassName} />
          </div>
          <div className="notification__custom">
            <p className="rnc__notification-message">{message}</p>
          </div>
        </div>
      )
    })
  )
}
