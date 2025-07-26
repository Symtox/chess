import {Renderer} from "./rendering/renderer.js";
import {GameState} from "./models/game-state.js";
import {MouseController} from "./controllers/mouse-controller.js";
import {GameEngine} from "./engine/game-engine.js";
import {coordinateAdapter} from "./rendering/positions.js";
import {ChessEngine} from "./engine/chess-engine.js";
import {CssAdapter} from "./adapters/css-adapter.js";
import {KeyboardController} from "./controllers/keyboard-controller.js";
import {AudioAdapter} from "./adapters/audio-adapter.js";
import {SidebarController} from "./controllers/sidebar-controller.js";
import {ClockAdapter} from "./adapters/clock-adapter.js";
import {Timer} from "./models/timer.js";
import {EndGameDialogAdapter} from "./adapters/end-game-dialog-adapter.js";

export class ChessGame {
  init(canvas) {
    this.renderer = new Renderer(canvas)
    this.gameState = new GameState()

    const chessEngine = new ChessEngine()
    const cssAdapter = new CssAdapter()
    const audioAdapter = new AudioAdapter()
    const endGameDialogAdapter = new EndGameDialogAdapter(document.querySelector('dialog'), this.reset.bind(this))

    const whiteClockAdapter = new ClockAdapter(document.querySelector('clock-el[data-color="white"]'))
    const blackClockAdapter = new ClockAdapter(document.querySelector('clock-el[data-color="black"]'))
    const whiteTimer = new Timer(whiteClockAdapter, 60 * 10 * 1000)
    const blackTimer = new Timer(blackClockAdapter,  60 * 10 * 1000)

    this.gameEngine = new GameEngine(
      this.gameState,
      chessEngine,
      cssAdapter,
      audioAdapter,
      whiteTimer,
      blackTimer,
      endGameDialogAdapter
    )


    coordinateAdapter.init(canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height, canvas.width, canvas.height)


    this.mouseController = new MouseController(this.gameEngine)
    this.mouseController.listen(canvas)

    this.keyBoardController = new KeyboardController(this.gameEngine)
    this.keyBoardController.listen(document)

    this.sidebarController = new SidebarController(this.gameEngine)
    this.sidebarController.listen(document.querySelector("aside"))

  }

  start() {
    const gameLoop = this.gameLoop.bind(this)
    requestAnimationFrame(gameLoop);
  }

  gameLoop() {
    this.renderer.render(this.gameState)
    requestAnimationFrame(() => this.gameLoop());
  }

  destroy() {
    this.mouseController.destroy()
    this.keyBoardController.destroy()
    this.sidebarController.destroy()
    this.gameEngine.destroy()
  }

  reset() {
    this.destroy()
    this.init(document.querySelector("canvas"))
  }
}