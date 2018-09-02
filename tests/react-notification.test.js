import React from "react";
import ReactNotification from "src/react-notification";
import Enzyme, { mount } from "enzyme";
import React16Adapter from "enzyme-adapter-react-16";
import sinon from "sinon";
import notificationMock from "tests/mocks/notification.mock";
import { NOTIFICATION_STAGE } from "src/constants";
import toJson from "enzyme-to-json";
import * as Helpers from "src/helpers";

Enzyme.configure({
  // react 16 adapter
  adapter: new React16Adapter()
});

describe("Notification component", () => {
  let clock;
  const getNotificationMock = (edits = {}) => Object.assign({}, notificationMock, edits);

  beforeEach(() => {
    // set fake timer
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    // restore fake timer
    clock.restore();
  });

  it("component renders custom content", () => {
    const component = mount(
      <ReactNotification notification={getNotificationMock({
        dismissable: {
          click: false,
          touch: false
        },
        content: <div className="custom-content"></div>
      })} />
    );

    expect(toJson(component)).toMatchSnapshot();
  });

  it("component renders dismiss icon", () => {
    const component = mount(
      <ReactNotification notification={getNotificationMock({
        title: null,
        dismissIcon: {
          className: "notification-close",
          content: <span>&times;</span>
        }
      })} />
    );

    expect(toJson(component)).toMatchSnapshot();
  });

  it("component clears timeout on umounting", () => {
    const spy = jest.spyOn(clock, "clearTimeout");
    const toggleTimeoutRemoval = jest.fn();
    const component = mount(
      <ReactNotification
        toggleTimeoutRemoval={toggleTimeoutRemoval}
        notification={
          getNotificationMock({
            dismiss: { duration: 400 }
          })
        } />
    );

    const timeoutId = component.instance().timeoutId;

    // timeout is set
    expect(timeoutId).toBeDefined();

    // unmount
    component.unmount();

    // expect clearTimeout to have been called
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(timeoutId);
  })

  it("onTransitionEnd updates state with needed CSS classes", () => {
    let component = mount(
      <ReactNotification notification={getNotificationMock({ animationIn: ["html5", "css3"] })} />
    );

    // manually call function
    component.instance().onTransitionEnd();
    // expect correct state update
    expect(component.state()).toMatchSnapshot();

    component = mount(
      <ReactNotification notification={getNotificationMock({ animationIn: null })} />
    );
    // manually call function
    component.instance().onTransitionEnd();
    // expect correct state update
    expect(component.state()).toMatchSnapshot();
  });

  it("onTouchSmartSlidingEnd returns if target node is NOT the root node", () => {
    const component = mount(
      <ReactNotification notification={getNotificationMock({
        stage: NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT
      })} />
    );

    component.find(".notification-item-child").simulate("transitionend");
    expect(component.instance().endOfSmartSliding).toBe(false);
  });

  it("onTouchSmartSlidingEnd toggles removal", () => {
    const toggleRemoval = jest.fn();
    const component = mount(
      <ReactNotification toggleRemoval={toggleRemoval} notification={getNotificationMock({
        stage: NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT
      })} />
    );

    component.find(".notification-item-root").simulate("transitionend")
    // expect endOfSmartSliding to be true
    expect(component.instance().endOfSmartSliding).toBe(true);

    component.find(".notification-item-root").simulate("transitionend")
    // expect toggleRemoval to be called
    expect(toggleRemoval.mock.calls.length).toBe(1);
  });

  it("onSmartSlidingEnd toggles removal for undefined/empty animationOut", () => {
    const toggleRemoval = jest.fn();
    let component = mount(
      <ReactNotification toggleRemoval={toggleRemoval} notification={getNotificationMock({
        stage: NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT,
        animationOut: null
      })} />
    );

    // trigger transitionend event
    component.find(".notification-item-root").simulate("transitionend");
    // expect mock call
    expect(toggleRemoval.mock.calls.length).toBe(1);

    component = mount(
      <ReactNotification toggleRemoval={toggleRemoval} notification={getNotificationMock({
        stage: NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT,
        animationOut: []
      })} />
    );

    // trigger transitionend event
    component.find(".notification-item-root").simulate("transitionend");
    // expect mock call
    expect(toggleRemoval.mock.calls.length).toBe(2);
  });

  it("onSmartSlidingEnd toggles removal on 2nd function call", () => {
    const toggleRemoval = jest.fn();
    const component = mount(
      <ReactNotification
        toggleRemoval={toggleRemoval}
        notification={getNotificationMock({
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

  it("component sets touch events to null on TOUCH_SLIDING_ANIMATION_EXIT", () => {
    Helpers.handleStageTransition = jest.fn().mockImplementation(() => ({
      rootElementStyle: {},
      childElementStyle: {}
    }));

    const component = mount(
      <ReactNotification notification={getNotificationMock({
        content: <div className="custom-cc"></div>,
        stage: NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT
      })} />
    );

    expect(toJson(component)).toMatchSnapshot();
  });

  it("componentDidMount sets initial state", () => {
    const spy = jest.spyOn(ReactNotification.prototype, "componentDidMount");

    let component = mount(
      <ReactNotification notification={getNotificationMock({ resized: false })} />
    );

    // expect mock to be called
    expect(spy.mock.calls.length).toBe(1);
    expect(component.state()).toMatchSnapshot();

    component = mount(
      <ReactNotification notification={getNotificationMock({ resized: true })} />
    );

    // expect mock to be called
    expect(spy.mock.calls.length).toBe(2);
    expect(component.state()).toMatchSnapshot();
  });

  it("timeout handler skips setting state if stage is REMOVAL/EXIT", () => {
    const notification = getNotificationMock({
      dismiss: { duration: 200 },
      stage: NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT
    });

    const component = mount(<ReactNotification notification={notification} />);

    // tick
    clock.tick(400);

    expect(component.state()).toMatchSnapshot();
  });

  it("timeout handler updates state", () => {
    const toggleTimeoutRemoval = jest.fn();

    const component = mount(<ReactNotification
      notification={getNotificationMock({
        dismiss: { duration: 100 },
        stage: undefined
      })}
      toggleTimeoutRemoval={toggleTimeoutRemoval}
    />);

    clock.tick(400);

    // expect mock to be called
    expect(toggleTimeoutRemoval.mock.calls.length).toBe(1);
    expect(component.state()).toMatchSnapshot();
  });

  it("component sets timeout for duration > 0", () => {
    // mount
    const component = mount(
      <ReactNotification
        notification={getNotificationMock({ dismiss: { duration: 2000 } })}
      />
    );

    // expect timeoutId to have been set
    expect(component.instance().timeoutId).toBeDefined();
  });

  it("component does not set timeout for duration = 0", () => {
    // add dismiss option with duration set
    const notification = getNotificationMock({ dismiss: { duration: 0 } });

    // mount
    const component = mount(<ReactNotification notification={notification} />);

    expect(component.instance().timeoutId).toBeUndefined();
  });

  it("component does not set timeout for duration < 0", () => {
    // add dismiss option with duration set
    const notification = getNotificationMock({ dismiss: { duration: -1 } });

    // mount
    const component = mount(<ReactNotification notification={notification} />);

    expect(component.instance().timeoutId).toBeUndefined();
  });

  it("component does not set timeout for undefined dismiss option", () => {
    const notification = getNotificationMock({ dismiss: {} });

    // mount
    const component = mount(<ReactNotification notification={notification} />);

    expect(component.instance().timeoutId).toBeUndefined();
  });

  it("clicks notification and calls onNotificationClick prop", () => {
    const onClickHandler = jest.fn();
    const spy = jest.spyOn(ReactNotification.prototype, "onNotificationClick");

    const component = mount(<ReactNotification
      notification={getNotificationMock({ dismissable: { click: true } })}
      onClickHandler={onClickHandler}
    />);

    // trigger click
    component.find(".notification-item-root").simulate("click");

    // expect instance onClickHandler to be called
    expect(spy.mock.calls.length).toBe(1);

    // tick 100ms for requestAnimation
    clock.tick(100);

    // expect onClickHandler prop to have been called
    expect(onClickHandler.mock.calls.length).toBe(1);
  });
});