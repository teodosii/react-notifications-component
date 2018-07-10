[![npm version](https://badge.fury.io/js/react-notifications-component.svg)](https://badge.fury.io/js/react-notifications-component) [![npm](https://img.shields.io/npm/dm/react-notifications-component.svg)](https://www.npmjs.com/package/react-notifications-component) [![GitHub license](https://img.shields.io/github/license/teodosii/react-notifications-component.svg)](https://github.com/teodosii/react-notifications-component/blob/master/LICENSE)

# react-notifications-component

Highly configurable and easy to use React component to render notifications.

### Demo

https://teodosii.github.io/react-notifications-component/

### Features

- Touch support
- Responsive notifications
- Predefined standard notification types (`default`, `success`, `info`, `danger`, `warning`)
- Custom notification types
- Custom notification content (`images`, `icons` etc)
- Dismiss after number of seconds
- Dismissable by swiping
- Dismissable by clicking
- Dismissable by custom X icon
- Custom animations on show
- Custom animations on exit
- Custom transitions on sliding
- Custom transitions on swiping
- Top/bottom notification insertion

### Install

```
npm install react-notifications-component
```

### Usage

You must place `ReactNotificationsComponent` component at the root level of the application in order to work properly, otherwise it might conflict with other DOM elements due to the positioning.

Use ref arrow syntax when declaring `ReactNotificationsComponent` in order to have access to internal method `addNotification`. All API methods provided must be called like this.

For further information on supported options, check documentation.

```jsx
import React from "react";
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
}
```

### Development

```
npm run build:library
npm run start
```

### Test

```
npm run test
```

### API

- #### `addNotification(options)`

Render a new notification. Method returns a unique ID representing the rendered notification. Supplied options are internally validated and an exception will be thrown if validation fails.

- #### `removeNotification(id)`

Manually remove a notification by ID. Nothing will happen if notification does not exist.


### Documentation

| Name             | Type              | Description                                                                                                                                              |
|------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| title            | `String`          | Title of the notification. Field is ignored if `content` is set, otherwise it is required                                                                |
| message          | `String`          | Message of the notification. Field is ignored if `content` is set, otherwise it is required                                                              |
| Content          | `React.Component` | Custom notification content, must be a valid `React` component                                                                                           |
| type             | `String`          | Type of the notification (`success`, `danger`, `default`, `info`, `warning` or `custom`). Field is ignored if `content` is set, otherwise it is required |
| container        | `String`          | Container in which the notification will be displayed (`top-left`, `top-right`, `bottom-left`, `bottom-right`). Field is required                        |
| insert           | `String`          | Insert notification at the `top` or at the `bottom` of the container. Defaults to `top`                                                                  |
| userDefinedTypes | `Array`           | Specify custom types you need to render                                                                                                                  |
| dismissable      | `Object`          | Specify how a notification should be manually dismissed - clicking or swiping                                                                            |
| dismissIcon      | `Object`          | Specify `className` (array of CSS classes) and `content` (valid `React` component) for custom X icon                                                     |
| animationIn      | `Array`           | CSS classes used to animate notification on show                                                                                                         |
| animationOut     | `Array`           | CSS classes used to animate notification on removal                                                                                                      |
| slidingEnter     | `Object`          | Specify `duration` (ms), `cubicBezier` (timing function) and `delay` (ms) for notification show transition                                              |
| slidingExit      | `Object`          | Specify `duration` (ms), `cubicBezier` (timing function) and `delay` (ms) for notification removal transition                                           |
| touchSlidingBack | `Object`          | Specify `duration` (ms), `cubicBezier` (timing function) and `delay` (ms) for reverting swipe transition                                                |
| touchSlidingExit | `Object`          | Specify `duration` (ms), `cubicBezier` (timing function) and `delay` (ms) for `swipe` and `fade` transitions when touch is complete                      |
| dismiss          | `Object`          | Specify `duration` (ms) after which time notification is automatically removed (`0` means `infinite`)                                                    |
| width            | `Number`          | Overwrite notification's width defined by stylesheets                                                                                                    |