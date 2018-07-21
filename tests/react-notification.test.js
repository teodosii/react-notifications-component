import React from "react";
import ReactNotification from "src/react-notification";
import Enzyme, { mount } from "enzyme";
import React16Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";
import sinon from "sinon";
import notificationObject from "tests/mocks/notification.mock";

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

  it("component sets timeout for duration > 0", () => {
    // add dismiss option with duration set
    let notification = Object.assign({}, notificationObject, {
      dismiss: { duration: 2000 }
    });

    // mount
    component = mount(<ReactNotification notification={notification} />);

    // expect timeoutId to have been set
    expect(instance().timeoutId).toBeDefined();
  });

  it("component does not set timeout for duration = 0", () => {
    // add dismiss option with duration set
    const notification = Object.assign({}, notificationObject, {
      dismiss: { duration: 0 }
    });

    // mount
    component = mount(<ReactNotification notification={notification} />);

    expect(instance().timeoutId).toBeUndefined();
  });

  it("component does not set timeout for duration < 0", () => {
    // add dismiss option with duration set
    const notification = Object.assign({}, notificationObject, {
      dismiss: { duration: -1 }
    });

    // mount
    component = mount(<ReactNotification notification={notification} />);

    expect(instance().timeoutId).toBeUndefined();
  });

  it("component does not set timeout for undefined dismiss option", () => {
    const notification = Object.assign({}, notificationObject, { dismiss: {} });

    // mount
    component = mount(<ReactNotification notification={notification} />);

    expect(instance().timeoutId).toBeUndefined();
  });

  it("clicks notification and calls onNotificationClick prop", () => {
    let onClickHandler = jest.fn();
    let spy = jest.spyOn(ReactNotification.prototype, "onNotificationClick");

    component = mount(<ReactNotification
      notification={notificationObject}
      onClickHandler={onClickHandler}
    />);

    // trigger click
    component.find(".notification-item").simulate("click");

    // expect instance onClickHandler to be called
    expect(spy.mock.calls.length).toBe(1);

    // tick 100ms for requestAnimation
    clock.tick(100);

    // expect onClickHandler prop to have been called
    expect(onClickHandler.mock.calls.length).toBe(1);
  });
});