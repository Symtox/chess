export class Timer {
  constructor(clockEl, duration) {
    this.duration = duration
    this.remaining = duration
    this.clockEl = clockEl
    this.intervalId = undefined
    this.clockEl.updateClock(duration)
  }

  start() {
    this.intervalId = setInterval(this.step.bind(this), 100)
  }

  stop() {
    if(this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  step() {
    this.remaining -= 100
    if(this.remaining <= 0) {
      this.remaining = 0
      this.clockEl.updateClock(0)
      this.stop()
      this.onTimeElapsed()
    }

    this.clockEl.updateClock(this.remaining)
  }

  onEnd(callback) {
    this.onTimeElapsed = callback
  }

}