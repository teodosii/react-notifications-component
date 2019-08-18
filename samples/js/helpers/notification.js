export default {
  title: "Awesomeness",
  message: "Awesome Notifications!",
  type: "success",
  container: "top-right",
  insert: "top",

  animationIn: ["animated", "fadeIn"],
  animationOut: ["animated", "bounceOutRight"],

  slidingEnter: {
    duration: 600,
    timingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    delay: 0
  },

  slidingExit: {
    duration: 600,
    timingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    delay: 0
  },

  touchSlidingBack: {
    duration: 600,
    timingFunction: "ease-in",
    delay: 0
  },

  touchSlidingExit: {
    swipe: {
      duration: 600,
      timingFunction: "ease-in",
      delay: 0,
    },
    fade: {
      duration: 300,
      timingFunction: "ease-in",
      delay: 0
    }
  },

  dismiss: {
    duration: 0,
    onScreen: false,
    pauseOnHover: true,
    waitForAnimation: true,
    touchSliding: false,
    click: true,
    touch: true
  }
};