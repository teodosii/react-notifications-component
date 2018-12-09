[![npm version](https://badgen.net/npm/v/react-notifications-component)](https://www.npmjs.com/package/react-notifications-component) [![npm](https://img.shields.io/npm/dm/react-notifications-component.svg)](https://www.npmjs.com/package/react-notifications-component) [![Build Status](https://travis-ci.org/teodosii/react-notifications-component.svg?branch=master)](https://travis-ci.org/teodosii/react-notifications-component) [![Coverage Status](https://coveralls.io/repos/github/teodosii/react-notifications-component/badge.svg?branch=master)](https://coveralls.io/github/teodosii/react-notifications-component?branch=master) [![Dependency Status](https://david-dm.org/teodosii/react-notifications-component.svg)](https://david-dm.org/teodosii/react-notifications-component) [![Minified & Gzipped size](https://badgen.net/bundlephobia/minzip/react-notifications-component)](https://bundlephobia.com/result?p=react-notifications-component) [![License](https://badgen.net/github/license/teodosii/react-notifications-component)]((https://badge.fury.io/js/react-notifications-component))

# react-notifications-component

Highly configurable and easy to use React component to notify your users!

## Demo

https://teodosii.github.io/react-notifications-component/

![alt text](https://raw.githubusercontent.com/teodosii/react-notifications-component/master/github-preview.gif "Preview")

## Features

<table>
  <tr>
    <td>Touch support</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Responsive notifications</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Standard notification types <br/> (<code>default</code>, <code>success</code>, <code>info</code>, <code>danger</code>, <code>warning</code>)</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Custom notification types</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Custom notification content <br />(<code>images</code>, <code>icons</code> etc)</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Dismiss after timeout</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Dismissable by swiping</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Dismissable by clicking</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Dismissable by custom &times; icon</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Custom animations on show</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Custom animations on exit</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Custom transitions on sliding</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Custom transitions on swiping</td>
    <td>:white_check_mark:</td>
  </tr>
  <tr>
    <td>Notification insertion at both ends of container</td>
    <td>:white_check_mark:</td>
  </tr>
</table>

## Install

```
npm install react-notifications-component
```

## Usage

You must place `ReactNotificationsComponent` component at the root level of the application in order to work properly, otherwise it might conflict with other DOM elements due to the positioning.

Use ref syntax when declaring `ReactNotificationsComponent` in order to have access to internal method `addNotification`. All API methods provided must be called like this.

For further information on supported options, check documentation.

```jsx
import React from "react";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  addNotification() {
    this.notificationDOMRef.current.addNotification({
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
        <ReactNotification ref={this.notificationDOMRef} />
        <button onClick={this.addNotification} className="btn btn-primary">
          Add Awesome Notification
        </button>
      </div>
    );
  }
}
```

**Note:** It is important to import `react-notifications-component` CSS theme, which is located in `dist/theme.css`

## Development

First build the library
```
npm run build:library:dev
```
then run the webpack server to see the app running
```
npm run start
```

## Test

```
npm run test
```

## API

`addNotification(options)`

Render a new notification. Method returns a unique ID representing the rendered notification. Supplied options are internally validated and an exception will be thrown if validation fails.

`removeNotification(id)`

Manually remove a notification by ID. Nothing will happen if notification does not exist.

## Examples

View examples [here](https://github.com/teodosii/react-notifications-component/blob/master/samples/README.md) and [here](https://github.com/teodosii/react-notifications-component/tree/master/samples/js/components/examples)

## Options

There are 2 types of options. In order to configure the root component - `<ReactNotificationComponent />` - you need to set props to be used as options

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>isMobile</td>
    <td><code>Boolean</code></td>
    <td>Set whether you want component to be <code>responsive</code> or not</td>
  </tr>
  <tr>
    <td>breakpoint</td>
    <td><code>Number</code></td>
    <td>Breakpoint for showing mobile notifications, it defaults to <code>768</code> (px). If window width is smaller than set number, then the responsive containers will be shown - <code>top</code> and <code>bottom</code></td>
  </tr>
  <tr>
    <td>types</td>
    <td><code>Object</code></td>
    <td><code>User defined types</code> - see examples on GitHub pages</td>
  </tr>
  <tr>
    <td>onNotificationRemoval</td>
    <td><code>Function</code></td>
    <td>Callback function to be called when notification has been removed. Function is called with <code>id</code> and <code>removedBy</code> as parameters. <code>removedBy</code> parameter takes one of the following values <ul><li>1 - <code>timeout</code></li> <li>2 - <code>click</code></li> <li>3 - <code>touch</code></li> <li>4 - <code>API call</code></li></ul></td>
  </tr>
</table>

In order to configure the notification itself you need to use the following properties when calling `addNotification`

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>id</td>
    <td><code>String</code></td>
    <td><code>Id</code> of the notification. Option is not required and should be used only if you want to have <code>custom</code> id over <code>random</code> id that is generated internally</td>
  </tr>
  <tr>
    <td>title</td>
    <td><code>String</code></td>
    <td>Title of the notification. Option is ignored if <code>content</code> is set</td>
  </tr>
  <tr>
    <td>message</td>
    <td><code>String</code></td>
    <td>Message of the notification. Option is ignored if <code>content</code> is set, otherwise it is <b>required</b></td>
  </tr>
  <tr>
    <td>content</td>
    <td><code>React.Component</code></td>
    <td>Custom notification content, must be a valid <code>React</code> component</td>
  </tr>
  <tr>
    <td>type</td>
    <td><code>String</code></td>
    <td>Type of the notification (<code>success</code>, <code>danger</code>, <code>default</code>, <code>info</code>, <code>warning</code> or <code>custom</code>). Option is ignored if <code>content</code> is set, otherwise it is <b>required</b></td>
  </tr>
  <tr>
    <td>container</td>
    <td><code>String</code></td>
    <td>Container in which the notification will be displayed (<code>top-left</code>, <code>top-right</code>, <code>bottom-left</code>, <code>bottom-right</code>). Option is <b>required<b></td>
  </tr>
  <tr>
    <td>insert</td>
    <td><code>String</code></td>
    <td>Insert notification at the <code>top</code> or at the <code>bottom</code> of the container. Option defaults to <code>top</code></td>
  </tr>
  <tr>
    <td>userDefinedTypes</td>
    <td><code>Array</code></td>
    <td>Define allowed types when rendering <code>custom</code> types <ul><li>htmlClasses - <code>Array</code> - CSS classes to be applied to the notification element</li><li>name - <code>String</code> - name of the custom type</li></ul></td>
  </tr>
  <tr>
    <td>dismissable</td>
    <td><code>Object</code></td>
    <td>Specify how a notification should be manually dismissed <ul><li>click - <code>Boolean</code> - dismiss by clicking (option defaults to <b>true</b>)</li><li>touch - <code>Boolean</code> - dismiss by swiping on mobile devices (option defaults to <b>true</b>)</li></ul></td>
  </tr>
  <tr>
    <td>dismissIcon</td>
    <td><code>Object</code></td>
    <td>Custom X icon <ul><li>className - <code>Array</code> - CSS classes to be applied to icon's parent</li><li>content - <code>React.Component</code> - must be a valid React component</li></ul></td>
  </tr>
  <tr>
    <td>animationIn</td>
    <td><code>Array</code></td>
    <td>CSS classes used to animate notification on <code>show</code></td>
  </tr>
  <tr>
    <td>animationOut</td>
    <td><code>Array</code></td>
    <td>CSS classes used to animate notification on <code>removal</code></td>
  </tr>
  <tr>
    <td>slidingEnter</td>
    <td><code>Object</code></td>
    <td>Transition to be used when sliding to show a notification <ul><li>duration - <code>Number</code> (ms)</li><li>cubicBezier - <code>String</code></li><li>delay - <code>Number</code> (ms)</li></ul>
  </tr>
  <tr>
    <td>slidingExit</td>
    <td><code>Object</code></td>
    <td>Transition to be used when sliding to hide a notification <ul><li>duration - <code>Number</code> (ms)</li><li>cubicBezier - <code>String</code></li><li>delay - <code>Number</code> (ms)</li></ul>
  </tr>
  <tr>
    <td>touchSlidingBack</td>
    <td><code>Object</code></td>
    <td>Transition to be used when sliding back after an incomplete swipe <ul><li>duration - <code>Number</code> (ms)</li><li>cubicBezier - <code>String</code></li><li>delay - <code>Number</code> (ms)</li></ul>
  </tr>
  <tr>
    <td>touchSlidingExit</td>
    <td><code>Object</code></td>
    <td>Transition to be used when sliding on swipe<ul><li>duration - <code>Number</code> (ms)</li><li>cubicBezier - <code>String</code></li><li>delay - <code>Number</code> (ms)</li></ul>
  </tr>
  <tr>
    <td>dismiss</td>
    <td><code>Object</code></td>
    <td>Automatically dismiss a notification after specified timeout <ul><li>duration - <code>Number</code> (ms - <code>0</code> means <code>Infinite</code>)</li></ul></td>
  </tr>
  <tr>
    <td>width</td>
    <td><code>Number</code></td>
    <td>Overwrite notification's <code>width</code> defined by stylesheets</td>
  </tr>
</table>