import React from "react";
import ReactNotification from "src/react-notification";
import Enzyme, { mount } from "enzyme";
import React16Adapter from "enzyme-adapter-react-16";
import sinon from "sinon";
import notificationMock from "tests/mocks/notification.mock";
import { NOTIFICATION_STAGE } from "src/constants";

Enzyme.configure({
  // react 16 adapter
  adapter: new React16Adapter()
});

describe("Notification component", () => {
  let clock;
  let component;

  // arrow function helpers
  const getNotificationMock = (edits = {}) => Object.assign({}, notificationMock, edits);
  const instance = () => component.instance();
  const state = () => component.state();

  beforeEach(() => {
    // set fake timer
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    // restore fake timer
    clock.restore();

    if (component) {
      // unmount
      component.unmount();
    }
  });

  it("onTransitionEnd updates state with needed CSS classes", () => {
    component = mount(
      <ReactNotification notification={getNotificationMock({ animationIn: ["html5", "css3"] })} />
    );

    // manually call function
    component.instance().onTransitionEnd();
    // expect correct state update
    expect(component.state).toMatchSnapshot();

    component = mount(
      <ReactNotification notification={getNotificationMock({ animationIn: null })} />
    );
    // manually call function
    component.instance().onTransitionEnd();
    // expect correct state update
    expect(component.state).toMatchSnapshot();
  });

  it("onTouchSmartSlidingEnd returns if target node is NOT the root node", () => {
    component = mount(
      <ReactNotification notification={getNotificationMock({
        stage: NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT
      })} />
    );

    component.find(".notification-item-child").simulate("transitionend");
    // expect endOfSmartSliding to be false
    expect(instance().endOfSmartSliding).toBe(false);
  });

  it("onTouchSmartSlidingEnd toggles removal", () => {
    const toggleRemoval = jest.fn();
    component = mount(
      <ReactNotification toggleRemoval={toggleRemoval} notification={getNotificationMock({
        stage: NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT
      })} />
    );

    component.find(".notification-item-root").simulate("transitionend")
    // expect endOfSmartSliding to be true
    expect(instance().endOfSmartSliding).toBe(true);

    component.find(".notification-item-root").simulate("transitionend")
    // expect toggleRemoval to be called
    expect(toggleRemoval.mock.calls.length).toBe(1);
  });

  it("onSmartSlidingEnd toggles removal for undefined/empty animationOut", () => {
    const toggleRemoval = jest.fn();
    component = mount(
      <ReactNotification toggleRemoval={toggleRemoval} notification={getNotificationMock({
        stage: NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT,
        animationOut: null
      })} />
    );

    // trigger transitionend event
    component.find(".notification-item-root").simulate("transitionend");
    expect(toggleRemoval.mock.calls.length).toBe(1);

    component = mount(
      <ReactNotification toggleRemoval={toggleRemoval} notification={getNotificationMock({
        stage: NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT,
        animationOut: []
      })} />
    );

    // trigger transitionend event
    component.find(".notification-item-root").simulate("transitionend");
    expect(toggleRemoval.mock.calls.length).toBe(2);
  });

  it("onSmartSlidingEnd toggles removal on 2nd function call", () => {
    const toggleRemoval = jest.fn();
    component = mount(
      <ReactNotification toggleRemoval={toggleRemoval} notification={getNotificationMock({
        stage: NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT
      })} />
    );

    // trigger transitionend event
    component.find(".notification-item-root").simulate("transitionend");
    expect(toggleRemoval.mock.calls.length).toBe(0);

    // trigger transitionend event
    component.find(".notification-item-root").simulate("transitionend");
    expect(toggleRemoval.mock.calls.length).toBe(1);
  });

  it("componentDidMount sets initial state", () => {
    const spy = jest.spyOn(ReactNotification.prototype, "componentDidMount");

    component = mount(
      <ReactNotification notification={getNotificationMock({ resized: false })} />
    );

    expect(spy.mock.calls.length).toBe(1);
    expect(state()).toMatchSnapshot();

    component = mount(
      <ReactNotification notification={getNotificationMock({ resized: true })} />
    );

    expect(spy.mock.calls.length).toBe(2);
    expect(state()).toMatchSnapshot();
  });

  it("timeout handler skips setting state if stage is REMOVAL/EXIT", () => {
    const notification = getNotificationMock({
      dismiss: { duration: 200 },
      stage: NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT
    });

    component = mount(<ReactNotification notification={notification} />);

    clock.tick(400);

    expect(component.state()).toMatchSnapshot();
  });

  it("timeout handler updates state", () => {
    const notification = getNotificationMock({
      dismiss: { duration: 100 },
      stage: undefined
    });
    const toggleTimeoutRemoval = jest.fn();

    component = mount(<ReactNotification
      notification={notification}
      toggleTimeoutRemoval={toggleTimeoutRemoval}
    />);

    clock.tick(400);

    expect(toggleTimeoutRemoval.mock.calls.length).toBe(1);
    expect(component.state()).toMatchSnapshot();
  });

  it("component sets timeout for duration > 0", () => {
    // add dismiss option with duration set
    const notification = getNotificationMock({ dismiss: { duration: 2000 } });

    // mount
    component = mount(<ReactNotification notification={notification} />);

    // expect timeoutId to have been set
    expect(instance().timeoutId).toBeDefined();
  });

  it("component does not set timeout for duration = 0", () => {
    // add dismiss option with duration set
    const notification = getNotificationMock({ dismiss: { duration: 0 } });

    // mount
    component = mount(<ReactNotification notification={notification} />);

    expect(instance().timeoutId).toBeUndefined();
  });

  it("component does not set timeout for duration < 0", () => {
    // add dismiss option with duration set
    const notification = getNotificationMock({ dismiss: { duration: -1 } });

    // mount
    component = mount(<ReactNotification notification={notification} />);

    expect(instance().timeoutId).toBeUndefined();
  });

  it("component does not set timeout for undefined dismiss option", () => {
    const notification = getNotificationMock({ dismiss: {} });

    // mount
    component = mount(<ReactNotification notification={notification} />);

    expect(instance().timeoutId).toBeUndefined();
  });

  it("clicks notification and calls onNotificationClick prop", () => {
    const onClickHandler = jest.fn();
    const spy = jest.spyOn(ReactNotification.prototype, "onNotificationClick");

    component = mount(<ReactNotification
      notification={notificationMock}
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