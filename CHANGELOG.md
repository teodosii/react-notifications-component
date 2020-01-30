# Changelog

## 2.3.0

### Fixes

* Fixed issue #52 - Swipe not working on touch devices
* Fixes issue #42 - `title` and `message` accept now custom content (a React node or a functional component)
* Fixed issue #41 - `pauseOnHover` was not taken into consideration when used together with `content`

## 2.2.0

### Fixes

* Merged pull request #31 to pass `className` to component
* Fixed issue #33 - Unsubscribe from `resize` once component was unmounted
* Fixed issue #35 - `content` now gets `id` supplied as a prop

## 2.1.0

### Breaking changes

* Removed prop `onNotificationRemoval` as it was rather hard to know which particular notification has been removed.

### Improvements

* Added option `onRemoval` directly to the notification object. Each notification will have its own `onRemoval`, making it easier to track removals.
* Removed `style-loader` from webpack dev config

## 2.0.0

### Breaking changes

* Ref usage has been deprecated. Import `store` from library and use it for adding and removing notifications
* `touchSlidingBack` has been renamed to `touchRevert`
* `dismissIcon` has been removed. Use `showIcon` instead. If you rely on customized close icon, then stick to custom content.
* `cubicBezier` has been renamed to `timingFunction`

### Improvements

* Validators are now no longer included in the prod build, they are only included in the dev build. If you inspect the npm package you will see that the component has 2 builds - `dev` and `prod` - and relies on ENV variable when importing.
* Default values for transitions have been slightly changed
* `dismiss` supports now more options

### Removed

* Test coverage has been removed as library's been almost fully rewritten in `2.0.0`

## 1.0.0

Stable and production ready release of `react-notifications-component`
