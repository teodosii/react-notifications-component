import React from "react";
import notificationObject from "tests/mocks/notification.mock";
import { cssWidth } from "src/utils";

import {
  isBottomContainer,
  isTopContainer,
  shouldNotificationHaveSliding,
  getHtmlClassesForType,
  getNotificationsForMobileView,
  getCubicBezierTransition,
  hasFullySwiped,
  getRootHeightStyle,
  getNotificationsForEachContainer,
  htmlClassesForExistingType,
  getNotificationOptions,
  getIconHtmlContent,
  getInitialSlidingState
} from "src/helpers";

import {
  validateWidth,
  validateInsert,
  validateDismissable,
  validateTimeoutDismissOption,
  validateTransition,
  validateTitle,
  validateMessage,
  validateType,
  validateContainer,
  validateUserDefinedTypes,
  validateAnimationOut,
  validateAnimationIn,
  validateDismissIconOption
} from "src/validators";

import {
  CONTAINER,
  INSERTION,
  NOTIFICATION_TYPE,
  NOTIFICATION_BASE_CLASS
} from "src/constants";

const getNotificationMock = (edits) => Object.assign({}, notificationObject, edits);
const getContentMock = () => <div className="content"></div>;
const getDefinedTypesMock = () => [{ name: "awesome", htmlClasses: ["awesome"] }];

describe("test suite for helpers", () => {
  it("isBottomContainer returns true if container is BOTTOM_*", () => {
    expect(isBottomContainer(CONTAINER.BOTTOM_LEFT)).toBe(true);
    expect(isBottomContainer(CONTAINER.BOTTOM_RIGHT)).toBe(true);
  });

  it("isBottomContainer returns false if container is TOP_*", () => {
    expect(isBottomContainer(CONTAINER.TOP_LEFT)).toBe(false);
    expect(isBottomContainer(CONTAINER.TOP_RIGHT)).toBe(false);
  });

  it("isTopContainer returns true if container is TOP_*", () => {
    expect(isTopContainer(CONTAINER.TOP_LEFT)).toBe(true);
    expect(isTopContainer(CONTAINER.TOP_RIGHT)).toBe(true);
  });

  it("isTopContainer returns false if container is BOTTOM_*", () => {
    expect(isTopContainer(CONTAINER.BOTTOM_LEFT)).toBe(false);
    expect(isTopContainer(CONTAINER.BOTTOM_RIGHT)).toBe(false);
  });

  it("notification will slide for top/top or bottom/bottom", () => {
    const { TOP, BOTTOM } = INSERTION;
    const { TOP_LEFT, BOTTOM_LEFT } = CONTAINER;

    // expect to have sliding for top/top
    expect(shouldNotificationHaveSliding({ insert: TOP, container: TOP_LEFT })).toBe(true);
    // expect to have sliding for bottom/bottom
    expect(shouldNotificationHaveSliding({ insert: BOTTOM, container: BOTTOM_LEFT })).toBe(true);
  });

  it("notification will not slide for bottom/top nor top/bottom", () => {
    const { TOP, BOTTOM } = INSERTION;
    const { TOP_LEFT, BOTTOM_LEFT } = CONTAINER;

    // no sliding for bottom/top combination
    expect(shouldNotificationHaveSliding({ insert: BOTTOM, container: TOP_LEFT })).toBe(false);
    // no sliding for top/bottom combination
    expect(shouldNotificationHaveSliding({ insert: TOP, container: BOTTOM_LEFT })).toBe(false);
  });

  it("htmlClassesForExistingType returns HTML classes based on type", () => {
    expect(htmlClassesForExistingType(NOTIFICATION_TYPE.DEFAULT)).toEqual([
      "notification-item",
      "notification-default"
    ]);

    expect(htmlClassesForExistingType(NOTIFICATION_TYPE.SUCCESS)).toEqual([
      "notification-item",
      "notification-success"
    ]);

    expect(htmlClassesForExistingType(NOTIFICATION_TYPE.DANGER)).toEqual([
      "notification-item",
      "notification-danger"
    ]);

    expect(htmlClassesForExistingType(NOTIFICATION_TYPE.WARNING)).toEqual([
      "notification-item",
      "notification-warning"
    ]);

    expect(htmlClassesForExistingType(NOTIFICATION_TYPE.INFO)).toEqual([
      "notification-item",
      "notification-info"
    ]);
  });

  it("htmlClassesForExistingType returns base class as default", () => {
    expect(htmlClassesForExistingType("OTHER")).toEqual([NOTIFICATION_BASE_CLASS]);
  })

  it("getHtmlClassesForType returns base class if content is defined", () => {
    const notification = getNotificationMock({ content: getContentMock() });

    expect(getHtmlClassesForType(notification)).toEqual([NOTIFICATION_BASE_CLASS]);
  });

  it("getHtmlClassesForType returns HTML classes if custom types are not defined", () => {
    const notification = getNotificationMock();
    delete notification.userDefinedTypes;

    expect(getHtmlClassesForType(notification)).toMatchSnapshot();
  });

  it("getHtmlClassesForType throws exception if custom defined type cannot be found", () => {
    const notification = getNotificationMock({ userDefinedTypes: [] });

    expect(() => getHtmlClassesForType(notification)).toThrow();
  });

  it("getHtmlClassesForType returns custom HTML classes if custom types are defined", () => {
    const notification = getNotificationMock({
      type: "awesome",
      userDefinedTypes: getDefinedTypesMock()
    });

    expect(getHtmlClassesForType(notification)).toMatchSnapshot();
  });

  it("getNotificationsForMobileView returns mobile notifications", () => {
    const notifications = [
      { container: CONTAINER.TOP_LEFT },
      { container: CONTAINER.TOP_RIGHT },
      { container: CONTAINER.BOTTOM_LEFT },
      { container: CONTAINER.BOTTOM_RIGHT }
    ];

    // expect not to throw expection for this scenario
    expect(() => getNotificationsForMobileView(notifications)).not.toThrow();

    // notifications for mobile
    const result = getNotificationsForMobileView(notifications);

    // expect to have have both top and bottom
    expect(result.top.length).toBe(2);
    expect(result.bottom.length).toBe(2);

    // expect to throw for invalid container
    expect(() => getNotificationsForMobileView([{ container: "" }])).toThrow();
  });

  it("getNotificationsForEachContainer returns desktop notifications for each container", () => {
    const result = getNotificationsForEachContainer([
      { container: CONTAINER.TOP_LEFT },
      { container: CONTAINER.TOP_RIGHT },
      { container: CONTAINER.BOTTOM_LEFT },
      { container: CONTAINER.BOTTOM_RIGHT }
    ]);

    // expect each container to be filled in
    expect(result.topLeft.length).toBe(1);
    expect(result.topRight.length).toBe(1);
    expect(result.bottomLeft.length).toBe(1);
    expect(result.bottomRight.length).toBe(1);

    // expect to throw for invalid container
    expect(() => getNotificationsForEachContainer([{ container: "" }])).toThrow();
  });

  it("CSS transition is properly returned based on duration|property|type|delay", () => {
    // no arguments supplied
    expect(getCubicBezierTransition()).toBe("500ms height linear 0ms");

    // only duration supplied
    expect(getCubicBezierTransition(800)).toBe("800ms height linear 0ms");

    // duration and easing
    expect(getCubicBezierTransition(800, "ease-out")).toBe("800ms height ease-out 0ms");

    // duration, easing, delay
    expect(getCubicBezierTransition(800, "ease-out", 100)).toBe("800ms height ease-out 100ms");

    // duration, easing, delay, property
    expect(getCubicBezierTransition(800, "ease-out", 200, "all")).toBe("800ms all ease-out 200ms");
  });

  it("hasFullySwiped returns true if notification swipes completely", () => {
    global.window.innerWidth = 100;
    expect(hasFullySwiped(40)).toBe(true);
  });

  it("hasFullySwiped returns false if notification does not swipe completely", () => {
    global.window.innerWidth = 100;
    expect(hasFullySwiped(35)).toBe(false);
  });

  it("getInitialSlidingState has sliding", () => {
    const notification = getNotificationMock({ insert: "top", container: "top-left" });
    const res = getInitialSlidingState({ notification, isFirstNotification: false });

    expect(res).toMatchSnapshot();
  });

  it("getInitialSlidingState has no sliding", () => {
    const notification = getNotificationMock({ insert: "top", container: "bottom-left" });
    const res = getInitialSlidingState({ notification, isFirstNotification: false });

    expect(res).toMatchSnapshot();
  });

  it("getInitialSlidingState has no animation", () => {
    const notification = getNotificationMock({ animationIn: [], insert: "top", container: "bottom-left" });
    const res = getInitialSlidingState({ notification, isFirstNotification: true });

    expect(res).toMatchSnapshot();
  });

  it("getIconHtmlContent returns custom icon", () => {
    const dismissIcon = { className: "react-awesome", content: getContentMock() };
    const notification = getNotificationMock({ dismissIcon });

    expect(getIconHtmlContent(notification)).toMatchSnapshot();
  });

  it("getIconHtmlContent returns standard icon", () => {
    const notification = getNotificationMock();
    delete notification.dismissIcon;

    expect(getIconHtmlContent(notification)).toMatchSnapshot();
  });

  it("cssWidth returns undefined for undefined width", () => {
    expect(cssWidth(undefined)).toBeUndefined();
  });

  it("cssWidth returns width in pixels", () => {
    expect(cssWidth(100)).toMatch("100px");
  });

  it("getNotificationOptions sets custom types if defined", () => {
    const notification = getNotificationMock();
    delete notification.content;
    const res = getNotificationOptions(notification, getDefinedTypesMock());

    expect(res).toMatchSnapshot({ id: expect.any(String) });
  });

  it("getNotificationOptions does not set custom types if content is defined", () => {
    const notification = getNotificationMock({ content: getContentMock() });
    const res = getNotificationOptions(notification, getDefinedTypesMock());

    expect(res).toMatchSnapshot({ id: expect.any(String) });
  });

  it("getNotificationOptions sets width if defined", () => {
    const notification = getNotificationMock({ width: 100 });

    expect(getNotificationOptions(notification)).toMatchSnapshot({ id: expect.any(String) });
  });

  it("getNotificationOptions sets default values", () => {
    let notification = getNotificationMock();
    delete notification.touchSlidingExit;
    expect(getNotificationOptions(notification)).toMatchSnapshot({ id: expect.any(String) });

    notification = getNotificationMock();
    delete notification.touchSlidingExit.swipe;
    delete notification.touchSlidingExit.fade;
    expect(getNotificationOptions(notification)).toMatchSnapshot({ id: expect.any(String) });
  });

  it("getHtmlClassesForType returns standard HTML classes if no custom types are defined", () => {
    const type = NOTIFICATION_TYPE;

    expect(getHtmlClassesForType({ type: type.DEFAULT })).toMatchSnapshot();
    expect(getHtmlClassesForType({ type: type.SUCCESS })).toMatchSnapshot();
    expect(getHtmlClassesForType({ type: type.DANGER })).toMatchSnapshot();
    expect(getHtmlClassesForType({ type: type.WARNING })).toMatchSnapshot();
    expect(getHtmlClassesForType({ type: type.INFO })).toMatchSnapshot();
  });

  it("getHtmlClassesForType search for custom type is case sensitive", () => {
    // expect to throw for case differences
    expect(() => getHtmlClassesForType({ type: "AWESOME", userDefinedTypes })).toThrow();
  });

  it("root element's style is properly set", () => {
    const slidingExit = { duration: 250, cubicBezier: "ease-out", delay: 100 };
    const notification = Object.assign({}, notificationObject, { slidingExit });

    // get style for root element
    const rootStyle = getRootHeightStyle(notification, 100);

    // height set on root element
    expect(rootStyle.height).toBe("100px");

    // transition has been set
    expect(rootStyle.transition).toBe("250ms height ease-out 100ms");
  });

  it("validates dismiss icon option", () => {
    // throws if className is not defined
    expect(() => validateDismissIconOption({})).toThrow();

    // throws if className is not String
    expect(() => validateDismissIconOption({ className: [1, 2] })).toThrow();

    // throws if content is not defined
    expect(() => validateDismissIconOption({ className: [] })).toThrow();

    // throws if content is not a valid React element
    expect(() => validateDismissIconOption({ className: [], content: [1, 2] })).toThrow();

    // throws if content is missing
    expect(() => validateDismissIconOption({ className: "hello-world" })).toThrow();

    // throws if content is not a valid React element
    expect(() => validateDismissIconOption({ className: "hello-world", content: [1, 2] })).toThrow();

    // normal behavior no throw
    expect(() => validateDismissIconOption({ className: "custom-icon", content: <div></div> })).not.toThrow();
  });

  it("validates timeout dismiss option", () => {
    // expect normal behaviour
    expect(() => validateTimeoutDismissOption()).not.toThrow();

    // expect to throw if duration is not set
    expect(() => validateTimeoutDismissOption({})).toThrow();

    // expect to throw for NaN duration
    expect(() => validateTimeoutDismissOption({ duration: "" })).toThrow();

    // expect to throw for negative duration
    expect(() => validateTimeoutDismissOption({ duration: -100 })).toThrow();
  });

  it("validates animation in", () => {
    // expect not to throw for null argument
    expect(() => validateAnimationIn(null)).not.toThrow();

    // expect empty array for missing argument
    expect(validateAnimationIn().length).toBe(0);

    // expect to throw for argument other than Array
    expect(() => validateAnimationIn(10)).toThrow();

    expect(validateAnimationIn(["github", "react"])).toEqual(["github", "react"]);
  });

  it("validates animation out", () => {
    // expect not to throw for null argument
    expect(() => validateAnimationOut(null)).not.toThrow();

    // expect empty array for missing argument
    expect(validateAnimationOut().length).toBe(0);

    // expect to throw for argument other than Array
    expect(() => validateAnimationOut(10)).toThrow();

    expect(validateAnimationOut(["github", "react"])).toEqual(["github", "react"]);
  });

  it("validates generic transition option", () => {
    const defaults = {
      duration: 1000,
      cubicBezier: "linear",
      delay: 0
    };

    // expect values to be set properly
    expect(validateTransition({
      duration: 300,
      cubicBezier: "ease-in",
      delay: 200
    }, defaults)).toEqual({
      duration: 300,
      cubicBezier: "ease-in",
      delay: 200
    });

    // expect default values to be set
    expect(validateTransition(null, defaults)).toEqual(defaults);

    // expect to throw for NaN duration
    expect(() => validateTransition({ duration: "" }, defaults)).toThrow();

    // expect to throw for cubicBezier not being a String
    expect(() => validateTransition({ cubicBezier: 0 }, defaults)).toThrow();

    // expect to throw for NaN delay
    expect(() => validateTransition({ delay: "" }, defaults)).toThrow();
  });

  it("validates title option", () => {
    // expect to skip for defined `content`
    expect(validateTitle({ content: getContentMock() })).toBeUndefined();

    // expect not to throw for undefined message
    expect(() => validateTitle({})).not.toThrow();

    // expect to throw for non String values
    expect(() => validateTitle({ title: 0 })).toThrow();
  });

  it("validates message option", () => {
    // expect to skip for defined `content`
    expect(validateMessage({ content: getContentMock() })).toBeUndefined();

    // expect to throw for undefined
    expect(() => validateMessage({})).toThrow();

    // expect to throw for non String values
    expect(() => validateMessage({ message: [] })).toThrow();
  });

  it("validates type option", () => {
    // expect to return if content is set
    expect(validateType({ content: getContentMock() })).toBeUndefined();

    // expect to throw for undefined type
    expect(() => validateType()).toThrow();

    // expect to throw if type is not string
    expect(() => validateType({ type: {} })).toThrow();

    // expect to throw for undefined type
    expect(() => validateType({})).toThrow();

    // expect to throw error for missing type
    expect(() => validateType({ type: "INVALID" })).toThrow();

    expect(validateType({ type: NOTIFICATION_TYPE.SUCCESS })).toBe("success");
  });

  it("validates container option", () => {
    expect(() => validateContainer()).toThrow();
    expect(() => validateContainer({})).toThrow();

    // expect lower case result
    expect(validateContainer("TOP")).toBe("top");
  })

  it("validates dismissable option", () => {
    const defaults = { click: true, touch: true };
    expect(validateDismissable()).toEqual(defaults);

    // expect empty object to match defaults
    expect(validateDismissable({})).toEqual(defaults);

    // test all possible T/F combinations
    expect(validateDismissable({ click: true, touch: true })).toEqual({ click: true, touch: true });
    expect(validateDismissable({ click: true, touch: false })).toEqual({ click: true, touch: false });
    expect(validateDismissable({ click: false, touch: true })).toEqual({ click: false, touch: true });
    expect(validateDismissable({ click: false, touch: false })).toEqual({ click: false, touch: false });

    // expect to throw for non boolean values
    expect(() => validateDismissable({ click: "true" })).toThrow();

    // expect to throw for non boolean values
    expect(() => validateDismissable({ touch: "true" })).toThrow();
  });

  it("validates user defined types", () => {
    const definedTypes = [{ name: "awesome" }];

    expect(validateUserDefinedTypes({ content: getContentMock() }, definedTypes)).toBeUndefined();
    expect(validateUserDefinedTypes({ type: NOTIFICATION_TYPE.SUCCESS }, definedTypes)).toBeUndefined();

    // should throw if type cannot be found
    expect(() => validateUserDefinedTypes({ type: "xtra" }, definedTypes)).toThrow();

    // expect not to throw
    expect(() => validateUserDefinedTypes({ type: "awesome" }, definedTypes)).not.toThrow();
  });

  it("validates insert option", () => {
    // expect default to be returned
    expect(validateInsert()).toBe("top");

    // expect actual value to be returned
    expect(validateInsert("top")).toBe("top");
    expect(validateInsert("bottom")).toBe("bottom");

    // expect to throw for invalid type
    expect(() => validateInsert({})).toThrow();
  });

  it("validates width option", () => {
    expect(validateWidth(100)).toBe(100);

    // expect to throw for NaN values
    expect(() => validateWidth({ width: {} })).toThrow();

    expect(validateWidth()).toBe(0);
  });
});