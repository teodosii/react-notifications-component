import React from "react";
import ReactNotification from "../src/react-notification";
import Enzyme, { mount } from "enzyme";
import React16Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";
import sinon from "sinon";
import notificationObject from "./utils/notification.mock";
import { createTouchObject } from "./utils/helpers";

// use adapter for react-16 to work with enzyme
Enzyme.configure({ adapter: new React16Adapter() });

describe("Notification component", () => {
  let clock;
  let component;
  let node;

  let instance = () => component.instance();

  beforeEach(() => {
    // set fake timer
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    // restore fake timer
    clock.restore();

    // unmount
    component.unmount();
  });

  it("sets timeout for duration > 0", () => {
    let change = { dismiss: { duration: 2000 } };
    let notification = Object.assign({}, notificationObject, change);

    // mount
    component = mount(<ReactNotification notification={notification} />);

    expect(instance().timeoutId).toBeNull();
    instance().setRemovalTimeout(notification.dismiss);
    expect(instance().timeoutId).not.toBeNull();
  });

  it("does not set timeout for duration = 0", () => {
    // merge object with dismiss
    const notification = Object.assign({}, notificationObject, { dismiss: { duration: 0 }});
    // mount
    component = mount(<ReactNotification notification={notification} />);

    expect(instance().timeoutId).toBeNull();
    instance().setRemovalTimeout(notification.dismiss);
    expect(instance().timeoutId).toBeNull();
  });

  it("does not set timeout for undefined `dismiss`", () => {
    // merge object with dismiss
    const notification = Object.assign({}, notificationObject, { dimiss: undefined });
    // mount
    component = mount(<ReactNotification notification={notification} />);

    expect(instance().timeoutId).toBeNull();
    instance().setRemovalTimeout(notification.dismiss);
    expect(instance().timeoutId).toBeNull();
  });

  it("clicks notification and calls `onNotificationClick` prop", () => {
    let onClickHandler = jest.fn();
    let spy = jest.spyOn(ReactNotification.prototype, "onNotificationClick");

    component = mount(<ReactNotification
      notification={notificationObject}
      isFirstNotification={true}
      onClickHandler={onClickHandler}
    />);

    // trigger click
    component.find(".notification-item").simulate("click");

    // expect instance onClickHandler to be called
    expect(spy.mock.calls.length).toBe(1);

    // tick 100ms for requestAnimation
    clock.tick(100);

    // expect `onClickHandler` prop to have been called
    expect(onClickHandler.mock.calls.length).toBe(1);
  });
});