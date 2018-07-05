# react-notifications-component

React component for creating notifications on the fly. Very configurable and easy to use API.

## Demo

https://teodosii.github.io/react-notifications-component/

## Install

`react-notifications-component` is available on NPM and can be installed directly by running:

```sh
$ npm install react-notifications-component
```

## Usage

In order not to have positional conflicts with other DOM elements, you need to place `ReactNotificationsComponent` component at the root level of the application to work properly. Otherwise notifications may not show properly.

Once you have a reference to `ReactNotificationsComponent`, call API method `addNotification` with options as the only argument. For further information on supported options, check documentation.

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

## Development

To run application locally in development mode run the following NPM scripts

```
npm run build:library
npm run start
```

### Features

- Highly configurable
- Touch support on mobile devices
- Responsive notifications
- Predefined containers for both mobile and desktop
- Predefined notification types
- Custom content
- Custom notification type
- Timeout option for dismissal
- Custom animations
- Custom transitions
- Both top and bottom insertion in container