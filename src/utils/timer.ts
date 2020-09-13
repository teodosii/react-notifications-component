export default class Timer {
  constructor(callback: Function, delay: number) {
    this.callback = callback;
    this.remaining = delay;

    this.resume();
  }

  private timerId: number;
  private start: number;
  private remaining: number;
  private callback: Function

  public pause() {
    clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.start;
  }

  resume() {
    this.start = Date.now();
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.callback, this.remaining);
  }

  clear() {
    clearTimeout(this.timerId);
  }
}