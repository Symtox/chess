export class SidebarController {
  constructor(gameEngine) {
    this.gameEngine = gameEngine
  }

  listen(sidebar) {
    this.el = sidebar
    sidebar.querySelector('#next')
      .addEventListener('click', () => this.gameEngine.nextMove())

    sidebar.querySelector('#previous')
      .addEventListener('click', () => this.gameEngine.undoMove())
  }

  destroy() {
    this.el.querySelector('#previous')
      .removeEventListener('click', () => this.gameEngine.undoMove())

    this.el.querySelector('#next')
      .removeEventListener('click', () => this.gameEngine.nextMove())
  }
}