export default {
  title: 'Awesomeness',
  message: 'Awesome Notifications!',
  type: 'success',
  container: 'top-right',
  insert: 'top',

  animationIn: ['animate__animated', 'animate__fadeIn'],
  animationOut: ['animate__animated', 'animate__faster', 'animated__fadeOut'],

  slidingEnter: {
    duration: 300,
    timingFunction: 'linear',
    delay: 0
  },

  slidingExit: {
    duration: 300,
    timingFunction: 'linear',
    delay: 0
  },

  touchRevert: {
    duration: 600,
    timingFunction: 'linear',
    delay: 0
  },

  touchSlidingExit: {
    swipe: {
      duration: 600,
      timingFunction: 'linear',
      delay: 0
    },
    fade: {
      duration: 300,
      timingFunction: 'linear',
      delay: 0
    }
  },

  dismiss: {
    duration: 0,
    onScreen: true,
    pauseOnHover: true,
    waitForAnimation: false,
    showIcon: true,
    click: true,
    touch: true
  }
}
