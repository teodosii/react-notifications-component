import React from 'react'
import { store } from 'src'
import ContainerExample from 'components/examples/ContainerExample'
import TypeExample from 'components/examples/TypeExample'
import InsertExample from 'components/examples/InsertExample'
import AnimationWrapper from 'components/examples/AnimationExample'
import CustomContentExample from 'components/examples/CustomContentExample'

function ExampleHeading() {
  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12 heading">
        <h2 className="text-center">Examples</h2>
        <button type="button" className="btn btn-outline-danger" onClick={() => store.removeAllNotifications()}>
          Remove All Notifications
        </button>
        <div className="alert alert-warning alert-small">
          <i className="fa fa-info-circle"></i>
          All notifications have been set to be automatically dismissed after{' '}
          <code className="white-code">5000ms</code>. Notifications can be manually dismissed by{' '}
          <code className="white-code">clicking</code> or by{' '}
          <code className="white-code">swiping</code> on mobile devices.
        </div>
      </div>
    </div>
  )
}

function Examples() {
  return (
    <React.Fragment>
      <ExampleHeading />
      <ContainerExample />
      <TypeExample />
      <CustomContentExample />
      <InsertExample />
      <AnimationWrapper />
    </React.Fragment>
  )
}

function Content() {
  return (
    <div className="content">
      <div className="container">
        <Examples />
      </div>
    </div>
  )
}

export default Content
