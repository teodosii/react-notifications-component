export const install = `npm install react-notifications-component`;

export const usage = `import React from "react";
import ReactNotification from "react-notifications-component";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addNotification = this.addNotification.bind(this);
  }

  addNotification() {
    this.notificationDOMRef.addNotification({
      title: "Awesomeness",
      message: "Awesome Notifications!",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  render() {
    return (
      <div className="app-content">
        <ReactNotification ref={input => this.notificationDOMRef = input} />
        <button onClick={this.addNotification} className="btn btn-primary">
          Add Awesome Notification
        </button>
      </div>
    );
  }
}`;

export const APIDocumentation = [{
  title: "title",
  type: "String",
  description: "Title of the notification. Field is ignored if <code class='white-code'>content</code> is set, otherwise it is required"
}, {
  title: "message",
  type: "String",
  description: "Message of the notification. Field is ignored if <code class='white-code'>content</code> is set, otherwise it is required"
}, {
  title: "content",
  type: "React.Component",
  description: "Custom notification content, must be a valid <code class='white-code'>React</code> component"
}, {
  title: "type",
  type: "String",
  description: "Type of the notification (<code class='white-code'>success</code>, <code class='white-code'>danger</code>, <code class='white-code'>default</code>, <code class='white-code'>info</code>, <code class='white-code'>warning</code> or <code class='white-code'>custom</code>). Field is ignored if <code class='white-code'>content</code> is set, otherwise it is required"
}, {
  title: "container",
  type: "String",
  description: "Container in which the notification will be displayed (<code class='white-code'>top-left</code>, <code class='white-code'>top-right</code>, <code class='white-code'>bottom-left</code>, <code class='white-code'>bottom-right</code>). Field is required"
}, {
  title: "insert",
  type: "String",
  def: "top",
  description: "Insert notification at the <code class='white-code'>top</code> or at the <code class='white-code'>bottom</code> of the container"
}, {
  title: "dismissable",
  type: "Object",
  description: "Set how a notification should be manually dismissed",
  properties: [{
    title: "click",
    type: "Boolean",
    def: "true",
    description: "Dismiss by click"
  }, {
    title: "touch",
    type: "Boolean",
    def: "true",
    description: "Dismiss by swiping on mobile devices"
  }]
}, {
  title: "animationIn",
  type: "Array",
  def: "[]",
  description: "Specify an array of CSS classes for doing the entrance animation. No animation will be done if field is left empty or undefined"
}, {
  title: "animationOut",
  type: "Array",
  def: "[]",
  description: "Specify an array of CSS classes for doing the exit animation. No animation will be done if field is left empty or undefined"
}, {
  title: "slidingEnter",
  type: "Object",
  description: "Specify duration, timing function and delay of the transition on notification show",
  properties: [{
    title: "duration",
    type: "Number",
    def: "600",
    description: "Entrance transition duration (ms)"
  }, {
    title: "cubicBezier",
    type: "String",
    def: "linear",
    description: "Specify any valid transition timing function for entrance transition"
  }, {
    title: "delay",
    type: "Number",
    def: "0",
    description: "Entrance transition initial delay (ms)"
  }]
}, {
  title: "slidingExit",
  type: "Object",
  description: "Specify duration, timing function and delay of the transition on notification exit",
  properties: [{
    title: "duration",
    type: "Number",
    def: "600",
    description: "Exit transition duration (ms)"
  }, {
    title: "cubicBezier",
    type: "String",
    def: "linear",
    description: "Specify any valid transition timing function for exit transition"
  }, {
    title: "delay",
    type: "Number",
    def: "0",
    description: "Exit transition initial delay (ms)"
  }]
}, {
  title: "touchSlidingBack",
  type: "Object",
  description: "Specify duration, timing function and delay for revert touch transition",
  properties: []
}, {
  title: "touchSlidingExit",
  type: "Object",
  description: "Specify duration, timing function and delay for swipe and fade when touch is complete",
  properties: []
}, {
  title: "dismiss",
  type: "Object",
  description: "Dismiss automatically",
  properties: [{
    title: "duration",
    type: "Number",
    def: "0",
    description: "Number of <code class='white-code'>milliseconds</code> before notification gets automatically dismissed. Duration of <code class='white-code'>0</code> means infinite"
  }]
}, {
  title: "width",
  type: "Number",
  description: "Overwrite notification's width defined by stylesheets"
}];