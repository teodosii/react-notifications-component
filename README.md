[![npm version](https://badge.fury.io/js/react-notifications-component.svg)](https://badge.fury.io/js/react-notifications-component) [![devDependencies Status](https://david-dm.org/teodosii/react-notifications-component/dev-status.svg)](https://david-dm.org/teodosii/react-notifications-component?type=dev)

# react-notifications-component

Highly configurable and easy to use React Component to notify your users!

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

**Note:** It is important to import `react-notifications-component` CSS theme, which is located in `dist\theme.css`

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


### Options

| Name             | Type              | Description                                                                                                                                              |
|------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| title            | `String`          | Title of the notification. Field is ignored if `content` is set                                                                |
| message          | `String`          | Message of the notification. Field is ignored if `content` is set, otherwise it is **required**                                                              |
| content          | `React.Component` | Custom notification content, must be a valid `React` component                                                                                           |
| type             | `String`          | Type of the notification (`success`, `danger`, `default`, `info`, `warning` or `custom`). Field is ignored if `content` is set, otherwise it is **required** |
| container        | `String`          | Container in which the notification will be displayed (`top-left`, `top-right`, `bottom-left`, `bottom-right`). Field is **required**                        |
| insert           | `String`          | Insert notification at the `top` or at the `bottom` of the container. _Defaults_ to `top`                                                                  |
| userDefinedTypes | `Array`           | Define allowed types when rendering `custom` types. Specify `htmlClasses` (`Array`) and `name` (`String`) as properties                                                                                |
| dismissable      | `Object`          | Specify how a notification should be manually dismissed - `clicking` or `swiping`                                                                            |
| dismissIcon      | `Object`          | Specify `className` (array of CSS classes) and `content` (valid `React` component) for custom X icon                                                     |
| animationIn      | `Array`           | CSS classes used to animate notification on `show`                                                                                                         |
| animationOut     | `Array`           | CSS classes used to animate notification on `removal`                                                                                                      |
| slidingEnter     | `Object`          | Specify `duration`, `cubicBezier` and `delay` for notification show transition                                              |
| slidingExit      | `Object`          | Specify `duration`, `cubicBezier` and `delay` for notification removal transition                                           |
| touchSlidingBack | `Object`          | Specify `duration`, `cubicBezier` and `delay` for reverting swipe transition                                                |
| touchSlidingExit | `Object`          | Specify `duration`, `cubicBezier` and `delay` for `swipe` and `fade` transitions when `touch` is complete                      |
| dismiss          | `Object`          | Specify `duration` after which time notification is automatically removed (`0` means `infinite`)                                                    |
| width            | `Number`          | Overwrite notification's `width` defined by stylesheets                                                                                                    |

### Roadmap

- Improve tests for better coverage (up to `100%`)
- Containers for other positions (`top-center`, `bottom-center`, `center` or even `custom`)
- Move `react-notifications-component` theme to a separate `npm` package
- Events support (`onShow`, `onRemoved`, `onClicked`, `onTimeoutDismissed` etc)
- Show time left (`progress-bar` like)
- `Modal` notification

**Note**: Some of the above mentioned are only ideas for now and may not be implemented