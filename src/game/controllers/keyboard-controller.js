export class KeyboardController {

  constructor(gameEngine) {
    this.gameEngine = gameEngine
  }

  listen(el) {
    this.el = el
    el.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  onKeyDown(e) {
    if(e.key === "ArrowLeft") {
      this.gameEngine.undoMove()
    }
    if(e.key === "ArrowRight") {
      this.gameEngine.nextMove()
    }
  }

  destroy() {
    this.el.removeEventListener('keydown', this.onKeyDown.bind(this))
  }
}