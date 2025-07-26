export class ClockAdapter {
  constructor(clock) {
    this.clock = clock
  }

  updateClock(time) {
    this.clock.updateClock(time)
  }

}