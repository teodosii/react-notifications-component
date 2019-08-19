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

## Examples

## Options

### Props

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

### Options
  
## License

MIT
