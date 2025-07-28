import {Clock} from "@/components/clock/clock";

export class ClockAdapter {
  private clock: Clock;

  constructor(clock: Clock) {
    this.clock = clock
  }

  updateClock(time: number) {
    this.clock.updateClock(time)
  }

}