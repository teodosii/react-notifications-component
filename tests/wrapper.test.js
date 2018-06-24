import React from "react";
import ReactNotificationComponent from "../src/react-notification-component";
import Enzyme, { mount, shallow } from "enzyme";
import React16Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";
import sinon from "sinon";
import notificationObject from "./utils/notification.mock";
import { createTouchObject } from "./utils/helpers";
import { NOTIFICATION_STAGE } from "../src/helpers";

// use adapter for react-16 to work with enzyme
Enzyme.configure({ adapter: new React16Adapter() });

describe("Wrapper component", () => {
  let component;
  let clock;
  let node;

  // arrow function helpers
  let instance = () => component.instance();
  let state = () => component.state();

  const triggerResize = (width) => {
    global.window.innerWidth = 100;
    const resizeEvent = document.createEvent("Event");
    resizeEvent.initEvent("resize", true, true);
    window.dispatchEvent(resizeEvent);
  };

  beforeEach(() => {
    // set fake timer
    clock = sinon.useFakeTimers();

    // mount component in DOM
    component = mount(<ReactNotificationComponent />);
  });

  afterEach(() => {
    // restore fake timer
    clock.restore();

    // unmount
    component.unmount();
  });

  it("responds to `resize` event", () => {
    const spy = jest.spyOn(
      ReactNotificationComponent.prototype,
      "handleResize"
    );

    // mount and add notifications
    component = mount(<ReactNotificationComponent />);
    instance().addNotification(notificationObject);
    instance().addNotification(notificationObject);
    instance().addNotification(notificationObject);

    // trigger window resize
    triggerResize(100);

    // expect width to be set accordingly
    expect(state().width).toBe(100);
    // expect `handleResize` to have been called
    expect(spy).toHaveBeenCalled();

    state().notifications.forEach(notification =>
      // expect each notification to have `resized` set
      expect(notification.resized).toBe(true)
    );
  });

  it("removes notification manually", () => {
    let notification;

    // mount
    component = mount(<ReactNotificationComponent />);
    let id = instance().addNotification(notificationObject);

    // manually remove notification
    instance().removeNotification(id);

    notification = state().notifications.find(item => item.id === id);
    expect(notification).not.toBeUndefined();
    expect(notification.stage).toBe(NOTIFICATION_STAGE.REMOVAL);

    // tick 100ms for requestAnimationFrame
    clock.tick(100);

    notification = state().notifications.find(item => item.id === id);
    expect(notification).not.toBeUndefined();
    expect(notification.stage).toBe(NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT);
  });

  it("updates stage to SLIDING_ANIMATION_EXIT on toggle-timeout", () => {
    // mount
    component = mount(<ReactNotificationComponent />);
    let id = component.instance().addNotification(notificationObject);

    // call `toggleTimeoutRemoval`
    component.instance().toggleTimeoutRemoval({ id });

    // get notification from state
    let notifications = component.state("notifications");
    let item = notifications.find(notif => notif.id === id);

    // expect item to be in state
    expect(item).not.toBeNull();
    expect(item).not.toBeUndefined();
    // expect stage to be set to SLIDING_ANIMATION_EXIT
    expect(item.stage).toBe(NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT);
  });

  it("updates stage to SLIDING_ANIMATION_EXIT on click", () => {
    // mount
    component = mount(<ReactNotificationComponent />);
    // add notification
    let id = instance().addNotification(notificationObject);
    // call method
    instance().onNotificationClick({ id, dismissable: { click: true } });

    // find notification by id
    let item = state().notifications.find(elem => elem.id === id);

    // expect stage to be set
    expect(item).not.toBeUndefined();
    expect(item.stage).toBe(NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT);
  });

  it("does not update stage to SLIDING_ANIMATION_EXIT on click", () => {
    // mount
    component = mount(<ReactNotificationComponent />);
    // add notification
    let id = instance().addNotification(notificationObject);
    // call method
    instance().onNotificationClick({ id, dismissable: {} });

    // find by id
    let item = state().notifications.find(elem => elem.id === id);

    // expect stage NOT to be set
    expect(item).not.toBeUndefined();
    expect(item.stage).not.toBe(NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT);
  });

  it("sets stage to TOUCH_SLIDING_ANIMATION_EXIT on toggling touch end", () => {
    // mount
    component = mount(<ReactNotificationComponent />);
    // add notification
    let id = instance().addNotification(notificationObject);

    // toggle touch end
    instance().toggleTouchEnd({ id });
    
    // find by id
    let item = state().notifications.find(elem => elem.id === id);

    // expect stage to be set
    expect(item).not.toBeUndefined();
    expect(item.stage).toBe(NOTIFICATION_STAGE.TOUCH_SLIDING_ANIMATION_EXIT);
  });

  it("toggles notification removal", () => {
    // mount
    component = mount(<ReactNotificationComponent />);
    // add notification
    let id = instance().addNotification(notificationObject);
    instance().addNotification(notificationObject);
    instance().addNotification(notificationObject);

    // expect lengt to match number of added notifications
    expect(state().notifications.length).toBe(3);

    // toggle removal
    instance().toggleRemoval({ id });
    
    // expect decrease
    expect(state().notifications.length).toBe(2);
  });

  it("returns rendered notifications", () => {
    // mount
    component = mount(<ReactNotificationComponent />);

    // render notifications based on array input
    let res = instance().renderReactNotifications([notificationObject]);

    // one notification rendered
    expect(res.length).toBe(1);

    let notif = res[0];
    expect(notif.props.notification).toBeDefined();
    expect(notif.props.isFirstNotification).toBeDefined();
    expect(notif.props.onClickHandler).toBeDefined();
    // expect(notif.props.onTransitionEnd).toBeDefined();
    expect(notif.props.toggleRemoval).toBeDefined();
    expect(notif.props.toggleTimeoutRemoval).toBeDefined();
    expect(notif.props.toggleTouchEnd).toBeDefined();
  });

  it("renders mobile if `isMobile` is set", () => {
    // width for mobile view
    global.window.innerWidth = 512;

    // mount
    component = mount(<ReactNotificationComponent isMobile={true} />);

    // all mobile containers rendered
    expect(component.find(".notification-container-mobile-top").length).toBe(1);
    expect(component.find(".notification-container-mobile-bottom").length).toBe(1);
  });

  it("renders desktop if `isMobile` is not set", () => {
    // width for mobile view
    global.window.innerWidth = 512;

    // mount
    component = mount(<ReactNotificationComponent />);

    // all desktop containers rendered
    expect(component.find(".notification-container-top-left").length).toBe(1);
    expect(component.find(".notification-container-top-right").length).toBe(1);
    expect(component.find(".notification-container-bottom-left").length).toBe(1);
    expect(component.find(".notification-container-bottom-right").length).toBe(1);
  });

  it("renders desktop view", () => {
    // width for desktop view
    global.window.innerWidth = 1024;

    // mount component
    component = mount(<ReactNotificationComponent />);

    // all desktop containers rendered
    expect(component.find(".notification-container-top-left").length).toBe(1);
    expect(component.find(".notification-container-top-right").length).toBe(1);
    expect(component.find(".notification-container-bottom-left").length).toBe(1);
    expect(component.find(".notification-container-bottom-right").length).toBe(1);

    // no mobile containers rendered
    expect(component.find(".notification-container-mobile-top").length).toBe(0);
    expect(component.find(".notification-container-mobile-bottom").length).toBe(0);
  });

  it("renders mobile view", () => {
    // width for mobile view
    global.window.innerWidth = 512;

    // mount component with isMobile prop
    component = mount(<ReactNotificationComponent isMobile={true} />);

    // expect mobile containers to be rendered
    expect(component.find(".notification-container-mobile-top").length).toBe(1);
    expect(component.find(".notification-container-mobile-top").length).toBe(1);

    // expect desktop containers not to be rendered
    expect(component.find(".notification-container-top-left").length).toBe(0);
    expect(component.find(".notification-container-top-right").length).toBe(0);
    expect(component.find(".notification-container-bottom-left").length).toBe(0);
    expect(component.find(".notification-container-bottom-right").length).toBe(0);
  });

  it("changes from desktop to mobile", () => {
    global.window.width = 1024;

    // mount component with isMobile prop
    component = mount(<ReactNotificationComponent isMobile={true} />);
    // manually update width to render mobile containers
    component.setState({ width: 512 });

    // expect mobile containers to be rendered
    expect(component.find(".notification-container-mobile-top").length).toBe(1);
    expect(component.find(".notification-container-mobile-bottom").length).toBe(1);

    // expect desktop containers not to be rendered
    expect(component.find(".notification-container-top-left").length).toBe(0);
    expect(component.find(".notification-container-top-right").length).toBe(0);
    expect(component.find(".notification-container-bottom-left").length).toBe(0);
    expect(component.find(".notification-container-bottom-right").length).toBe(0);
  });

  it("changes from mobile to desktop", () => {
    global.window.width = 512;

    // mount component
    component = mount(<ReactNotificationComponent isMobile={true} />);
    // set state to render mobile view
    component.setState({ width: 1024 });

    // expect no mobile containers to be rendered
    expect(component.find(".notification-container-mobile-top").length).toBe(0);
    expect(component.find(".notification-container-mobile-bottom").length).toBe(0);

    // expect desktop containers to be rendered
    expect(component.find(".notification-container-top-left").length).toBe(1);
    expect(component.find(".notification-container-top-right").length).toBe(1);
    expect(component.find(".notification-container-bottom-left").length).toBe(1);
    expect(component.find(".notification-container-bottom-right").length).toBe(1);
  });
});