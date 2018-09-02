import notificationObject from "tests/mocks/notification.mock";
import * as Helpers from "src/helpers";

describe("test suite for stage-helpers", () => {
  const expectedMaxLeft = 2048;
  const getNotificationMock = (edits) => Object.assign({}, notificationObject, edits);

  it("notification slides to the right edge of the window", () => {
    global.window.innerWidth = expectedMaxLeft / 2;

    // (25, Y) => (100, Y)
    const res = Helpers.getChildStyleForTouchTransitionExit(notificationObject, 25, 100);
    const rightEdge = expectedMaxLeft;

    // expect left to be set
    expect(res.left).toBe(`${rightEdge}px`);
    // expect position to be set
    expect(res.position).toBe("relative");

    expect(res).toMatchSnapshot();
  });

  it("notification slides to the left edge of the window", () => {
    global.window.innerWidth = expectedMaxLeft / 2;

    // (100, Y) => (0, Y);
    const res = Helpers.getChildStyleForTouchTransitionExit(getNotificationMock(), 100, 0);
    const leftEdge = -expectedMaxLeft;

    // expect left to be set
    expect(res.left).toBe(`${leftEdge}px`);
    // expect position to be set
    expect(res.position).toBe("relative");

    expect(res).toMatchSnapshot();
  });

  it("adds CSS animation classes on removal if animationOut is defined", () => {
    // animationOut option is defined
    const notification = getNotificationMock({ animationOut: ["jest-test"] });
    const res = Helpers.handleSlidingAnimationExit(notification);

    expect(res).toMatchSnapshot();
  });

  it("does not add CSS animation classes on removal if animationOut is undefined", () => {
    // animationOut option is undefined
    const notification = getNotificationMock({ animationOut: undefined });
    // delete notification.animationOut;
    const res = Helpers.handleSlidingAnimationExit(notification);

    expect(res).toMatchSnapshot();
  });
});