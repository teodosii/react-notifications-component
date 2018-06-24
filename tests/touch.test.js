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

describe("Touch events", () => {
  let clock;
  let component;
  let node;

  // must set initial style to make JSDom work properly
  const touchBeginState = {
    rootElementStyle: {
      height: "100px",
      position: "relative",
      top: 0,
      left: 0
    }
  };

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

  it("swipes to the left", () => {
    component = mount(
      <ReactNotification
        notification={notificationObject}
        isFirstNotification={true}
      />
    );

    // set touch state
    component.setState(touchBeginState);

    // trigger touch events
    component.find(".notification-item").simulate("touchstart", createTouchObject({ x: 0 }));
    component.find(".notification-item").simulate("touchmove", createTouchObject({ x: -50 }));

    // expect notification to be moved to the left side
    expect(component.state().childElementStyle.left).toBe("-50px");
  });

  it("swipes to the right", () => {
    component = mount(
      <ReactNotification
        notification={notificationObject}
        isFirstNotification={true}
      />
    );

    // set touch state
    component.setState(touchBeginState);

    // trigger touch start
    component.find(".notification-item").simulate("touchstart", createTouchObject({ x: 0 }));
    // trigger touch move
    component.find(".notification-item").simulate("touchmove", createTouchObject({ x: 50 }));

    // expect notification to be moved to the right side
    expect(component.state().childElementStyle.left).toBe("50px");
  });

  it("swipes 100%", () => {
    let toggleTouchEnd = jest.fn();

    component = mount(
      <ReactNotification
        notification={notificationObject}
        isFirstNotification={true}
        toggleTouchEnd={toggleTouchEnd}
      />
    );

    component.setState(touchBeginState);

    // trigger touch start
    component.find(".notification-item").simulate("touchstart", createTouchObject({ x: 0 }));
    // trigger touch move
    component.find(".notification-item").simulate("touchmove", createTouchObject({ x: 100 }));
    // trigger touch move
    component.find(".notification-item").simulate("touchmove", createTouchObject({ x: 200 }));
    // trigger touch move
    component.find(".notification-item").simulate("touchmove", createTouchObject({ x: 500 }));

    // needed for requestAnimationFrame to finish
    clock.tick(100);

    // expect toggleTouchEnd to be called
    expect(toggleTouchEnd.mock.calls.length).toBe(1);
  });

  it("swipes partially", () => {
    let toggleTouchEnd = jest.fn();

    component = mount(
      <ReactNotification
        notification={notificationObject}
        isFirstNotification={true}
        toggleTouchEnd={toggleTouchEnd}
      />
    );

    component.setState(touchBeginState);

    // simulate touch start
    component.find(".notification-item").simulate("touchstart", createTouchObject({ x: 0 }));
    // simulate touch move
    component.find(".notification-item").simulate("touchmove", createTouchObject({ x: 50 }));
    // simulate touch end
    component.find(".notification-item").simulate("touchend", createTouchObject({ x: 50 }));

    // expect notification to be moved back to its original position
    expect(component.state().childElementStyle.left).toBe("0");

    // expect that notification is not removed
    expect(toggleTouchEnd.mock.calls.length).toBe(0);
  });

  it("cancels swipe", () => {
    let toggleTouchEnd = jest.fn();

    component = mount(
      <ReactNotification
        notification={notificationObject}
        isFirstNotification={true}
        toggleTouchEnd={toggleTouchEnd}
      />
    );

    component.setState(touchBeginState);

    // trigger touch start
    component.find(".notification-item").simulate("touchstart", createTouchObject({ x: 0 }));
    // trigger touch move
    component.find(".notification-item").simulate("touchmove", createTouchObject({ x: 100 }));

    // expect `left` to be 100px
    expect(component.state().childElementStyle.left).toBe("100px");

    // trigger touch cancel
    component.find(".notification-item").simulate("touchcancel");

    // expect `left` to be back to 0
    expect(component.state().childElementStyle.left).toBe("0");
  });
});