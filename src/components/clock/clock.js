import {padNumber} from "../../utils/utils.js";

export class Clock extends HTMLElement {
  constructor() {
    super();

    this.timeElement = document.createElement('div')
    this.timeElement.innerText = 0
    this.timeElement.classList = ['timer']

    this.innerState = 0

    this.appendChild(this.timeElement);
  }

  updateClock(time) {
    if(time !== this.innerState) {
      this.innerState = time
      this.updateElement(time)
    }
  }

  updateElement(time) {
    this.timeElement.innerText = `${this.getFormatedMinutes(time)} : ${this.getFormatedSeconds(time)}`
  }

  getFormatedMinutes(time) {
    return padNumber(Math.trunc(time / (60 * 1000)), 2)
  }

  getFormatedSeconds(time) {
    return padNumber(Math.floor((time / 1000) % 60 ), 2)
  }
}
