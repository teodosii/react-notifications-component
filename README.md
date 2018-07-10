# react-notifications-component

Highly configurable and easy to use React component to render notifications.

### Demo

https://teodosii.github.io/react-notifications-component/

### Features

- Touch support
- Responsive notifications
- Custom notification types
- Custom notification content (images, icons etc)
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

| Name             | Type            | Default | Description                                                                                                                                              |
|------------------|-----------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| title            | String          |         | Title of the notification. Field is ignored if `content` is set, otherwise it is required                                                                |
| message          | String          |         | Message of the notification. Field is ignored if `content` is set, otherwise it is required                                                              |
| Content          | React.Component |         | Custom notification content, must be a valid `React` component                                                                                           |
| type             | String          |         | Type of the notification (`success`, `danger`, `default`, `info`, `warning` or `custom`). Field is ignored if `content` is set, otherwise it is required |
| container        | String          |         | Container in which the notification will be displayed (`top-left`, `top-right`, `bottom-left`, `bottom-right`). Field is required                        |
| insert           | String          | top     | Insert notification at the top or at the bottom of the container                                                                                         |
| dismissable      | Object          |         | Set how a notification should be manually dismissed                                                                                                      |
| animationIn      | Array           |         | Specify an array of CSS classes for doing the entrance animation. No animation will be done if field is left empty or undefined                          |
| animationOut     | Array           |         | Specify an array of CSS classes for doing the exit animation. No animation will be done if field is left empty or undefined                              |
| slidingEnter     | Object          |         | Specify duration, timing function and delay of the transition on notification show                                                                       |
| slidingExit      | Object          |         | Specify duration, timing function and delay of the transition on notification exit                                                                       |
| touchSlidingBack | Object          |         | Specify duration, timing function and delay for revert touch transition                                                                                  |
| touchSlidingExit | Object          |         | Specify duration, timing function and delay for swipe and fade when touch is complete                                                                    |
| dismiss          | dismiss         |         | Dismiss automatically                                                                                                                                    |
| width            | Number          |         | Overwrite notification's width defined by stylesheets                                                                                                    |