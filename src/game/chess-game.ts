import { Renderer } from "./rendering/renderer";
import { GameState } from "./models/game-state";
import { MouseController } from "./controllers/mouse-controller";
import { GameEngine } from "./engine/game-engine";
import { coordinateAdapter } from "./rendering/positions";
import { ChessEngine } from "./engine/chess-engine";
import { CssAdapter } from "./adapters/css-adapter";
import { KeyboardController } from "./controllers/keyboard-controller";
import { AudioAdapter } from "./adapters/audio-adapter";
import { SidebarController } from "./controllers/sidebar-controller";
import { ClockAdapter } from "./adapters/clock-adapter";
import { Timer } from "./models/timer";
import { EndGameDialogAdapter } from "@/game/adapters/end-game-dialog-adapter";
import { Clock } from "@/components/clock/clock";

export class ChessGame {
  private renderer: Renderer;
  private gameState: GameState;
  private mouseController: MouseController;
  private keyBoardController: KeyboardController;
  private sidebarController: SidebarController;
  private gameEngine: GameEngine;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.gameState = new GameState();

    const chessEngine = new ChessEngine();
    const cssAdapter = new CssAdapter();
    const audioAdapter = new AudioAdapter();
    const endGameDialogAdapter = new EndGameDialogAdapter(
      document.querySelector("dialog") as HTMLDialogElement,
      this.reset.bind(this),
    );

    const whiteClockAdapter = new ClockAdapter(
      document.querySelector('clock-el[data-color="white"]') as Clock,
    );
    const blackClockAdapter = new ClockAdapter(
      document.querySelector('clock-el[data-color="black"]') as Clock,
    );
    const whiteTimer = new Timer(whiteClockAdapter, 60 * 10 * 1000);
    const blackTimer = new Timer(blackClockAdapter, 60 * 10 * 1000);

    this.gameEngine = new GameEngine(
      this.gameState,
      chessEngine,
      cssAdapter,
      audioAdapter,
      whiteTimer,
      blackTimer,
      endGameDialogAdapter,
    );

    coordinateAdapter.init(
      canvas.getBoundingClientRect().width,
      canvas.getBoundingClientRect().height,
      canvas.width,
      canvas.height,
    );

    this.mouseController = new MouseController(this.gameEngine);
    this.mouseController.listen(canvas);

    this.keyBoardController = new KeyboardController(this.gameEngine);
    this.keyBoardController.listen(document);

    this.sidebarController = new SidebarController(this.gameEngine);
    this.sidebarController.listen(
      document.querySelector("aside") as HTMLElement,
    );
  }

  start() {
    const gameLoop = this.gameLoop.bind(this);
    requestAnimationFrame(gameLoop);
  }

  gameLoop() {
    this.renderer.render(this.gameState);
    requestAnimationFrame(() => this.gameLoop());
  }

  destroy() {
    this.mouseController.destroy();
    this.keyBoardController.destroy();
    this.sidebarController.destroy();
    this.gameEngine.destroy();
  }

  reset() {
    this.destroy();
    // this.init(document.querySelector("canvas") as HTMLCanvasElement)
  }
}
