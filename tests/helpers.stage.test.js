import notificationObject from "./utils/notification.mock";
import * as Helpers from "../src/helpers";

describe("test suite for stage-helpers", () => {
  const expectedMaxLeft = 2048;
  const touchSwipeTransition = "400ms left ease-out 0ms";
  const touchFadeTransition = "200ms opacity ease-out 0ms";
  const mockImplementation = mock => jest.fn().mockImplementation(() => mock);

  it("notification slides to the right edge of the window", () => {
    global.window.innerWidth = expectedMaxLeft / 2;

    // mock CSS transitions
    Helpers.touchSwipeTransition = mockImplementation(touchSwipeTransition);
    Helpers.touchFadeTransition = mockImplementation(touchFadeTransition);

    // (25, Y) => (100, Y)
    const res = Helpers.getChildStyleForTouchTransitionExit(notificationObject, 25, 100);
    const rightEdge = expectedMaxLeft;

    // expect left to be set
    expect(res.left).toBe(`${rightEdge}px`);

    // expect position to be set
    expect(res.position).toBe("relative");

    // expect both transitions to be set
    expect(res.transition).toBe(`${touchSwipeTransition}, ${touchFadeTransition}`);
  });

  it("notification slides to the left edge of the window", () => {
    global.window.innerWidth = expectedMaxLeft / 2;

    // mock CSS transitions
    Helpers.touchSwipeTransition = mockImplementation(touchSwipeTransition);
    Helpers.touchFadeTransition = mockImplementation(touchFadeTransition);

    // (100, Y) => (0, Y);
    const res = Helpers.getChildStyleForTouchTransitionExit(notificationObject, 100, 0);
    const leftEdge = -expectedMaxLeft;

    // expect left to be set
    expect(res.left).toBe(`${leftEdge}px`);

    // expect position to be set
    expect(res.position).toBe("relative");

    // expect both transitions to be set
    expect(res.transition).toBe(`${touchSwipeTransition}, ${touchFadeTransition}`);
  });

  it("adds CSS animation classes on removal if animationOut is defined", () => {
    jest.spyOn(Helpers, "getHtmlClassesForType").mockImplementation(() => ["react-test"]);

    // animationOut option is defined
    const notification = Object.assign({}, notificationObject, { animationOut: ["jest-test"] });
    const res = Helpers.handleSlidingAnimationExit(notification);

    expect(res.animatedElementClasses).toEqual(["react-test", "jest-test"]);
  });

  it("does not add CSS animation classes on removal if animationOut is undefined", () => {
    jest.spyOn(Helpers, "getHtmlClassesForType").mockImplementation(() => ["react-test"]);

    // animationOut option is undefined
    const notification = Object.assign({}, notificationObject);
    delete notification.animationOut;

    const res = Helpers.handleSlidingAnimationExit(notification);

    expect(res.animatedElementClasses).toEqual(["react-test"]);
  });
});