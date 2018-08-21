export default {
  title: "Success",

  message: "Document has been updated!",

  type: "success",

  container: "top-right",

  insert: "top",

  dismissable: {
    click: true,
    touch: false,
  },

  // CSS animation classes
  animationIn: ["animated", "fadeIn"],
  animationOut: ["animated", "fadeOut"],

  // sliding enter transition
  slidingEnter: {
    duration: 600,
    cubicBezier: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    delay: 0
  },

  // sliding exit transition
  slidingExit: {
    duration: 600,
    cubicBezier: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    delay: 0
  },

  // touch sliding back transition
  touchSlidingBack: {
    duration: 600,
    cubicBezier: "ease-in",
    delay: 0
  },

  // touch sliding exit transition
  touchSlidingExit: {
    swipe: {
      duration: 600,
      cubicBezier: "ease-in",
      delay: 0,
    },
    fade: {
      duration: 300,
      cubicBezier: "ease-in",
      delay: 0
    }
  }
};