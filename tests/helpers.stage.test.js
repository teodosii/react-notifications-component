import notificationObject from "./utils/notification.mock";
import * as StageHelpers from "../src/stage-helpers";
import * as Helpers from "../src/helpers";

describe("Stage helpers", () => {
  const expectedMaxLeft = 2048;

  it("properly slides notification to left or right based on X swipe position", () => {
    global.window.innerWidth = expectedMaxLeft / 2;

    // mock swipe transition
    StageHelpers.touchSwipeTransition = jest.fn().mockImplementation(() => "400ms left ease-out 0ms");
    // mock fade transition
    StageHelpers.touchFadeTransition = jest.fn().mockImplementation(() => "200ms opacity ease-out 0ms");

    expect(StageHelpers.getChildStyleForTouchTransitionExit(notificationObject, 100, 25)).toEqual({
      opacity: 0,
      position: "relative",
      left: `${expectedMaxLeft}px`,
      transition: "400ms left ease-out 0ms, 200ms opacity ease-out 0ms"
    });

    expect(StageHelpers.getChildStyleForTouchTransitionExit(notificationObject, -100, 25)).toEqual({
      opacity: 0,
      position: "relative",
      left: `-${expectedMaxLeft}px`,
      transition: "400ms left ease-out 0ms, 200ms opacity ease-out 0ms"
    });
  });

  it("adds animation classes if `animationOut` is defined on sliding-animation-exit", () => {
    // mock `getHtmlClassForType` to return array
    jest.spyOn(Helpers, "getHtmlClassesForType").mockImplementation(() => ["react-test"]);

    // test case where animationOut is defined on notification
    const notification = Object.assign({}, notificationObject, { animationOut: ["jest-test"] });
    const res = StageHelpers.handleSlidingAnimationExit(notification);

    expect(res.animatedElementClasses).toEqual(["react-test", "jest-test"]);
  });

  it("does not add animation classes if `animationOut` is not defined on sliding-animation-exit", () => {
    // mock `getHtmlClassForType` to return array
    jest.spyOn(Helpers, "getHtmlClassesForType").mockImplementation(() => ["react-test"]);

    // test case where animationOut is not defined on notification
    const notification = Object.assign({}, notificationObject, { animationOut: [] });
    // remove `animationOut` property
    delete notification.animationOut;
    // call method again
    const res = StageHelpers.handleSlidingAnimationExit(notification);

    expect(res.animatedElementClasses).toEqual(["react-test"]);
  });
});