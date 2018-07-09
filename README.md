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

##### `addNotification(options)`

Render a new notification. Options will be valided internally and an error will be thrown if validation fails. Method returns a unique ID representing the rendered notification.

##### `removeNotification(id)`

Manually remove a notification by ID. Nothing will happen if notification does not exist.