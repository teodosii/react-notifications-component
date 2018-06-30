import React from "react";
import ReactNotificationComponent from "../src/react-notification-component";
import Enzyme, { mount, shallow } from "enzyme";
import React16Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";
import sinon from "sinon";
import notificationObject from "./utils/notification.mock";
import { createTouchObject } from "./utils/helpers";
import { NOTIFICATION_STAGE } from "../src/constants";

// use adapter for react-16 to work with enzyme
Enzyme.configure({ adapter: new React16Adapter() });

describe("Wrapper component", () => {
  let component;
  let clock;
  let node;

  // arrow function helpers
  const getObject = () => Object.assign({}, notificationObject);
  const instance = () => component.instance();
  const state = () => component.state();

  // add notification helper
  const addNotification = (notifObject) => instance().addNotification(notifObject);

  const triggerResize = (width) => {
    // set initial width
    global.window.innerWidth = 100;

    // create `resize` event
    const resizeEvent = document.createEvent("Event");
    resizeEvent.initEvent("resize", true, true);

    // trigger resize
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
    const spy = jest.spyOn(ReactNotificationComponent.prototype, "handleResize");

    // mount component
    component = mount(<ReactNotificationComponent />);

    // add notifications
    addNotification(getObject());
    addNotification(getObject());
    addNotification(getObject());

    // trigger window resize
    triggerResize(100);

    // expect width to be set accordingly
    expect(state().width).toBe(100);

    // expect `handleResize` to have been called
    expect(spy).toHaveBeenCalled();

    // expect each notification to have `resized` set
    state().notifications.forEach(notification => expect(notification.resized).toBe(true));
  });

  it("removes notification manually", () => {
    let notification;

    // mount
    component = mount(<ReactNotificationComponent />);

    // add notification and store id
    let id = addNotification(getObject());

    // manually remove notification
    instance().removeNotification(id);

    notification = state().notifications.find(item => item.id === id);

    // expect REMOVAL stage
    expect(notification.stage).toBe(NOTIFICATION_STAGE.REMOVAL);

    // tick
    clock.tick(100);

    notification = state().notifications.find(item => item.id === id);

    // expect SLIDING_ANIMATION_EXIT stage
    expect(notification.stage).toBe(NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT);
  });

  it("updates stage to SLIDING_ANIMATION_EXIT on toggle-timeout", () => {
    // mount
    component = mount(<ReactNotificationComponent />);

    // add notification
    let id = addNotification(getObject());

    // call `toggleTimeoutRemoval`
    instance().toggleTimeoutRemoval({ id });

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
    let id = addNotification(getObject());
    const dismissable = { click: true };

    // trigger click
    instance().onNotificationClick({ id, dismissable });

    // tick
    clock.tick(100);

    // find notification by id
    let item = state().notifications.find(elem => elem.id === id);

    // expect stage to be set
    expect(item.stage).toBe(NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT);
  });

  it("does not update stage to SLIDING_ANIMATION_EXIT on click", () => {
    // mount
    component = mount(<ReactNotificationComponent />);

    // add notification
    const id = addNotification(getObject());
    const dismissable = {};

    // trigger click
    instance().onNotificationClick({ id, dismissable });

    // tick
    clock.tick(100);

    // find by id
    let item = state().notifications.find(elem => elem.id === id);

    // expect stage to be set
    expect(item.stage).not.toBe(NOTIFICATION_STAGE.SLIDING_ANIMATION_EXIT);
  });

  it("sets stage to TOUCH_SLIDING_ANIMATION_EXIT on touch end", () => {
    // mount
    component = mount(<ReactNotificationComponent />);

    // add notification
    let id = addNotification(getObject());

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

    // add notifications
    let id = addNotification(getObject());

    // expect lengt to match number of added notifications
    expect(state().notifications.length).toBe(1);

    // toggle removal
    instance().toggleRemoval({ id });

    // tick
    clock.tick(100);

    // expect decrease
    expect(component.state().notifications.length).toBe(0);
  });

  it("renders notification properly", () => {
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