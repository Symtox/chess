import { ClockAdapter } from "@/game/adapters/clock-adapter";

export class Timer {
  private duration: number;
  private remaining: number;
  private clockEl: ClockAdapter;
  private intervalId: ReturnType<typeof setInterval> | undefined;
  private onTimeElapsed: () => void = () => {};

  constructor(clockEl: ClockAdapter, duration: number) {
    this.duration = duration;
    this.remaining = duration;
    this.clockEl = clockEl;
    this.intervalId = undefined;
    this.clockEl.updateClock(duration);
  }

  start() {
    this.intervalId = setInterval(this.step.bind(this), 100);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  step() {
    this.remaining -= 100;
    if (this.remaining <= 0) {
      this.remaining = 0;
      this.clockEl.updateClock(0);
      this.stop();
      this.onTimeElapsed();
    }

    this.clockEl.updateClock(this.remaining);
  }

  onEnd(callback: () => void) {
    this.onTimeElapsed = callback;
  }
}
