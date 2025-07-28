import { GameEngine } from "@/game/engine/game-engine";

export class SidebarController {
  private gameEngine: GameEngine;
  private el: HTMLElement | null = null;
  constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
  }

  listen(sidebar: HTMLElement) {
    this.el = sidebar;
    sidebar
      .querySelector("#next")
      ?.addEventListener("click", () => this.gameEngine.nextMove());

    sidebar
      .querySelector("#previous")
      ?.addEventListener("click", () => this.gameEngine.undoMove());
  }

  destroy() {
    if (!this.el) throw new Error("TODO");

    this.el
      .querySelector("#previous")
      ?.removeEventListener("click", () => this.gameEngine.undoMove());

    this.el
      .querySelector("#next")
      ?.removeEventListener("click", () => this.gameEngine.nextMove());
  }
}
