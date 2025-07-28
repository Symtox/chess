export class Clock extends HTMLElement {
  private readonly timeElement: HTMLDivElement;
  private innerState: number;

  constructor() {
    super();

    this.timeElement = document.createElement("div");
    this.timeElement.innerText = "0";
    this.timeElement.classList.add("timer");

    this.innerState = 0;

    this.appendChild(this.timeElement);
  }

  updateClock(time: number) {
    if (time !== this.innerState) {
      this.innerState = time;
      this.updateElement(time);
    }
  }

  updateElement(time: number) {
    this.timeElement.innerText = `${this.getFormatedMinutes(time)} : ${this.getFormatedSeconds(time)}`;
  }

  getFormatedMinutes(time: number) {
    return Math.trunc(time / (60 * 1000))
      .toString()
      .padStart(2, "0");
  }

  getFormatedSeconds(time: number) {
    return Math.floor((time / 1000) % 60)
      .toString()
      .padStart(2, "0");
  }
}
