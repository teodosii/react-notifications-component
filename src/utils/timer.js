export default function(callback, delay) {
  let timerId;
  let start;
  let remaining = delay;

  this.pause = function() {
    clearTimeout(timerId);
    remaining -= Date.now() - start;
  };

  this.resume = function() {
    start = Date.now();
    clearTimeout(timerId);
    timerId = setTimeout(callback, remaining);
  };

  this.clear = function() {
    clearTimeout(timerId);
  };

  this.resume();
}
