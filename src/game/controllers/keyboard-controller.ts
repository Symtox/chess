import {GameEngine} from "@/game/engine/game-engine";

export class KeyboardController {
  private el: Element | null = null
  private gameEngine: GameEngine

  constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine
  }

  listen(el: any) {
    this.el = el
    el.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  onKeyDown(e: KeyboardEvent) {
    if(e.key === "ArrowLeft") {
      this.gameEngine.undoMove()
    }
    if(e.key === "ArrowRight") {
      this.gameEngine.nextMove()
    }
  }

  destroy() {
    if(this.el) {
      this.el?.removeEventListener('keydown', this.onKeyDown.bind(this))
    }
  }
}