[![npm version](https://badgen.net/npm/v/react-notifications-component)](https://www.npmjs.com/package/react-notifications-component) [![Build Status](https://travis-ci.org/teodosii/react-notifications-component.svg?branch=master)](https://travis-ci.org/teodosii/react-notifications-component) [![Minified & Gzipped size](https://badgen.net/bundlephobia/minzip/react-notifications-component)](https://bundlephobia.com/result?p=react-notifications-component)
# react-notifications-component

A delightful, easy to use and highly configurable component to help you notify your users out of the box. No messy setup, just beautiful notifications!

## Demo

https://teodosii.github.io/react-notifications-component/

![alt text](https://raw.githubusercontent.com/teodosii/react-notifications-component/master/github-preview.gif "Preview")

## Features

* Touch support
* Responsive notifications
* Standard notification types
* Custom notification types
* Custom notification content
* Dismissable (touch, click, timeout)
* Customizable transitions
* Small library

## Getting started

```
npm install react-notifications-component
```

### Development

First build the library
```
npm run build:library:dev
```
then run the webpack server to see the app running
```
npm run start
```

## Usage

###

Import <code>react-notifications-component</code>
```js
import ReactNotification from 'react-notifications-component'
```
Import the <code>CSS</code> theme
```js
import 'react-notifications-component/theme.css'
```

##### SASS
<code>SASS</code> files are located in `react-notifications-component/scss`

Render <code>react-notifications-component</code> at the top of your application so that it does not conflict with other absolutely positioned DOM elements.
```jsx
const App = () => {
  return (
    <div className="app-container">
      <ReactNotification />
      <Application />
    </div>
  )
};
```

Import <code>store</code> where needed - will be used to access `addNotification` and `removeNotification` API methods
```js
import { store } from 'react-notifications-component';
```

Then call `addNotification` and watch the magic happens

```jsx
store.addNotification({
  title: "Wonderful!",
  message: "teodosii@react-notifications-component",
  type: "success",
  insert: "top",
  container: "top-right",
  animationIn: ["animated", "fadeIn"],
  animationOut: ["animated", "fadeOut"],
  dismiss: {
    duration: 5000,
    onScreen: true
  }
});
```

Voila!

## API

`store.addNotification(options)`

Render a new notification. Method returns a unique id for the rendered notification. Supplied options are internally validated and an exception will be thrown if validation fails.

`store.removeNotification(id)`

Manually remove a notification by id.


## Examples

In progress

## Props

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>isMobile</code></td>
    <td><code>Boolean</code></td>
    <td>Set whether you want component to be responsive or not. To be used together with <code>breakpoint</codee></td>
  </tr>
  <tr>
    <td><code>breakpoint</code></td>
    <td><code>Number</code></td>
    <td>Breakpoint for responsiveness - defaults to <code>768</code>px</td>
  </tr>
  <tr>
    <td><code>types</code></td>
    <td><code>Array</code></td>
    <td>Custom types</td>
  </tr>
  <tr>
    <td><code>onNotificationRemoval</code></td>
    <td><code>Function</code></td>
    <td>Gets called on notification removal with <code>id</code> and <code>removedBy</code> arguments</td>
  </tr>
</table>

## Options

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>id</code></td>
    <td><code>String</code></td>
    <td>Id of the notification. Supply option only if you prefer to have custom id, otherwise you should let the component handle generation for you.</td>
  </tr>
  <tr>
    <td><code>title</code></td>
    <td><code>String</code></td>
    <td>Title of the notification. Option is ignored if <code>content</code> is set, otherwise it is <b>required</b>.</td>
  </tr>
  <tr>
    <td><code>message</code></td>
    <td><code>String</code></td>
    <td>Message of the notification. Option is ignored if <code>content</code> is set, otherwise it is <b>required</b>.</td>
  </tr>
  <tr>
    <td><code>content</code></td>
    <td><code>Object</code></td>
    <td>Custom notification content, must be either <b>Class Component</b>, <b>Functional Component</b> or <b>React element</b>.</td>
  </tr>
  <tr>
    <td><code>type</code></td>
    <td><code>String</code></td>
    <td>Type of the notification. Option is ignored if <code>content</code> is set, otherwise it is <b>required</b>.</td>
  </tr>
  <tr>
    <td><code>container</code></td>
    <td><code>String</code></td>
    <td>Container in which the notification will be displayed. Option is <b>required<b>.</td>
  </tr>
  <tr>
    <td><code>insert</code></td>
    <td><code>String</code></td>
    <td>Specify where to append notification into the container - top or bottom. Option defaults to <code>top</code>.</td>
  </tr>
  <tr>
    <td><code>dismiss</code></td>
    <td><code>Dismiss</code></td>
    <td>Specify how a notification should be dismissed.</td>
  </tr>
  <tr>
    <td><code>animationIn</code></td>
    <td><code>Array</code></td>
    <td>Array of CSS classes for animating the notification's entrance.</td>
  </tr>
  <tr>
    <td><code>animationOut</code></td>
    <td><code>Array</code></td>
    <td>Array of CSS classes for animating the notification's exit.</td>
  </tr>
  <tr>
    <td><code>slidingEnter</code></td>
    <td><code>Transition</code></td>
    <td>Transition to be used when sliding to show a notification.</td>
  </tr>
  <tr>
    <td><code>slidingExit</code></td>
    <td><code>Transition</code></td>
    <td>Transition to be used when sliding to remove a notification.</td>
  </tr>
  <tr>
    <td><code>touchRevert</code></td>
    <td><code>Transition</code></td>
    <td>Transition to be used when sliding back after an incomplete swipe.</td>
  </tr>
  <tr>
    <td><code>touchSlidingExit</code></td>
    <td><code>Transition</code></td>
    <td>Transition to be used when sliding on swipe.</td>
  </tr>
  <tr>
    <td><code>width</code></td>
    <td><code>Number</code></td>
    <td>Overwrite notification's <code>width</code> defined by CSS</td>
  </tr>
</table>
  
#### Transition

<code>Transition</code> is used each time you define a transition.

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>duration</code></td>
    <td><code>Number</code></td>
    <td>Transition duration in ms. Its default value ranges from 300 to 600, depending on transition</td>
  </tr>
  <tr>
    <td><code>timingFunction</code></td>
    <td><code>String</code></td>
    <td>CSS timing function for the transition, defaults to <code>linear</code></td>
  </tr>
  <tr>
    <td><code>delay</code></td>
    <td><code>Number</code></td>
    <td>Delay of the transition in ms, defaults to 0</td>
  </tr>
</table>

#### Dismiss

<code>Dismiss</code> is used to describe how a notification should be dismissed.

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>duration</code></td>
    <td><code>Number</code></td>
    <td>Time in milliseconds after notification gets dismissed. 0 will act as infinite duration. Defaults to <code>0</code></td>
  </tr>
  <tr>
    <td><code>onScreen</code></td>
    <td><code>Boolean</code></td>
    <td>Show time left directly on the notification. Defaults to <code>false</code></td>
  </tr>
  <tr>
    <td><code>pauseOnHover</code></td>
    <td><code>Boolean</code></td>
    <td>Hovering over notification will pause the dismiss timer. Defaults to <code>false</code></td>
  </tr>
  <tr>
    <td><code>waitForAnimation</code></td>
    <td><code>Boolean</code></td>
    <td>When removing a notification by default we trigger the exit animation and the transition to height 0 at the same time. Setting this to <code>true</code> will wait for the exit animation to finish and then start the transition to height 0. Defaults to <code>false</code></td>
  </tr>
  <tr>
    <td><code>click</code></td>
    <td><code>Boolean</code></td>
    <td>Enable dismissal by click, defaults to <code>true</code></td>
  </tr>
  <tr>
    <td><code>touch</code></td>
    <td><code>Boolean</code></td>
    <td>Enable dismiss by touch move, defaults to <code>true</code></td>
  </tr>
  <tr>
    <td><code>showIcon</code></td>
    <td><code>Boolean</code></td>
    <td>Show or hide the close icon, defaults to <code>false</code>. If set to <code>true</code>, it will respond to click interaction and will remove notification</td>
  </tr>
</table>
  
## Migration from v1

* Ref usage has been deprecated. Import `store` from library and use it for adding and removing notifications
* `touchSlidingBack` has been renamed to `touchRevert`
* Default values for transitions have been slightly changed
* `dismissIcon` has been removed. Use `showIcon` instead. If you relly on customized close icon, then stick to custom content.
* `dismiss` supports now more options
* Validators are now no longer included in the prod build, they are only included in the dev build. If you inspect the npm package you will see that the component has 2 builds - `dev` and `prod` - and relies on ENV variable when importing.
  
## License

MIT
