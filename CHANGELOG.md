# Changelog

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
