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

## API

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
    <td><code>isMobile</code></td>
    <td><code>Boolean</code></td>
    <td>Set whether you want component to be responsive or not. Setting it to be responsive will render the mobile containers only - top and bottom.</td>
  </tr>
  <tr>
    <td><code>breakpoint</code></td>
    <td><code>Number</code></td>
    <td>Breakpoint for responsiveness - defaults to 768px</td>
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

In order to configure the notification itself you need to use the following properties when calling `addNotification`
  
## License

MIT
