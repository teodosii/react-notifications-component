import React from 'react'
import notification from 'samples/js/helpers/notification'
import { getContainer, getMessage, getType } from 'samples/js/helpers/randomize'
import { Store } from 'src'
import { iNotification } from 'src/types'

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
            onClick={() => add(true, ['animate__animated animate__bounceIn'])}
          >
            Bounce In
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animate_animated animate__fadeIn'])}
          >
            Fade In
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animate__animated animated__flipInX'])}
          >
            Flip In X
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animate__animated animate__flipInY'])}
          >
            Flip In Y
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animate__animated animate__zoomIn'])}
          >
            Zoom In
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animate__animated animate__flash'])}
          >
            Flash
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(true, ['animate__animated animate__jackInTheBox'])}
          >
            Jack In The Box
          </button>
        </div>
      </div>
    </div>
  )
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
            onClick={() => add(false, ['animate__animated animate__bounceOut'])}
          >
            Bounce Out
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(false, ['animate__animated animate__fadeOut'])}
          >
            Fade Out
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(false, ['animate__animated animate__flipOutX'])}
          >
            Flip Out X
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(false, ['animate__animated animate__flipOutY'])}
          >
            Flip Out Y
          </button>
          {' '}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => add(false, ['animate__animated animate__zoomOut'])}
          >
            Zoom Out
          </button>
          {' '}
        </div>
      </div>
    </div>
  )
}

function add(isEntranceAnimation: boolean, htmlClasses: string[]) {
  const type = getType()
  const object: iNotification = {}

  if (isEntranceAnimation) {
    return Store.addNotification(
      Object.assign(object, notification, {
        animationIn: htmlClasses,
        container: getContainer(),
        message: getMessage(type),
        type
      })
    )
  }

  return Store.addNotification(
    Object.assign(object, notification, {
      slidingExit: { delay: 300 },
      animationOut: htmlClasses,
      container: getContainer(),
      message: getMessage(type),
      type
    })
  )
}

export default function AnimationWrapper() {
  return (
    <div>
      <AnimationInExample/>
      <AnimationOutExample/>
    </div>
  )
}
