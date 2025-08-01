import { coordinateAdapter } from "../rendering/positions";
import { GameState } from "@/game/models/game-state";
import { ChessEngine } from "@/game/engine/chess-engine";
import { CssAdapter } from "@/game/adapters/css-adapter";
import { AudioAdapter } from "@/game/adapters/audio-adapter";
import { Timer } from "@/game/models/timer";
import { EndGameDialogAdapter } from "@/game/adapters/end-game-dialog-adapter";
import {
  Color,
  Coordinate,
  getMoveIndicationCoordinates,
  getOpponentColor,
  isCastle,
  Move,
} from "@/types/types";
import { applyMove, getTrait, goToPreviousMove } from "@/types/game";

export class GameEngine {
  private gameState: GameState;
  private chessEngine: ChessEngine;
  private cssAdapter: CssAdapter;
  private audioAdapter: AudioAdapter;
  private whiteTimer: Timer;
  private blackTimer: Timer;
  private dialogAdapter: EndGameDialogAdapter;

  constructor(
    gameState: GameState,
    chessEngine: ChessEngine,
    cssAdapter: CssAdapter,
    audioAdapter: AudioAdapter,
    whiteTimer: Timer,
    blackTimer: Timer,
    dialogAdapter: EndGameDialogAdapter,
  ) {
    this.gameState = gameState;
    this.chessEngine = chessEngine;
    this.cssAdapter = cssAdapter;
    this.audioAdapter = audioAdapter;
    this.whiteTimer = whiteTimer;
    this.blackTimer = blackTimer;

    this.dialogAdapter = dialogAdapter;

    this.whiteTimer.onEnd(() => this.loseOnTime("white"));
    this.blackTimer.onEnd(() => this.loseOnTime("black"));
  }

  grab(dx: number, dy: number) {
    const canvasPos = coordinateAdapter.fromDomToCanvas({ x: dx, y: dy });
    const pos = coordinateAdapter.fromCanvasToGrid(canvasPos);
    const piece = this.gameState.game.board[pos.x][pos.y];
    if (piece && piece.color === getTrait(this.gameState.game)) {
      this.cssAdapter.changeCursor("grabbing");
      this.gameState.setSelection(
        {
          x: canvasPos.x,
          y: canvasPos.y,
          initialPosX: pos.x,
          initialPosY: pos.y,
          piece: piece,
        },
        this.chessEngine.computeAllowedMoves(piece, pos, this.gameState.game),
      );
    }
  }

  move(x: number, y: number) {
    if (!this.gameState.getSelection()) {
      return;
    }

    const canvasPos = coordinateAdapter.fromDomToCanvas({ x: x, y: y });
    this.gameState.getSelection().x = canvasPos.x;
    this.gameState.getSelection().y = canvasPos.y;
  }

  discardSelection() {
    this.gameState.setSelection(undefined, []);
  }

  drop(dx: number, dy: number) {
    if (!this.gameState.getSelection()) return;

    const pos = coordinateAdapter.fromDomToGrid({ x: dx, y: dy });

    const move = this.gameState.allowedMoves.find(
      (move) =>
        getMoveIndicationCoordinates(move).x === pos.x &&
        getMoveIndicationCoordinates(move).y === pos.y,
    );
    if (move) {
      this.playMove(move);
    }

    if (this.isHoveringPiecePlayablePiece(pos)) {
      this.cssAdapter.changeCursor("grab");
    } else {
      this.cssAdapter.changeCursor("default");
    }

    this.gameState.setSelection(undefined, []);
  }

  isHoveringPiecePlayablePiece(pos: Coordinate) {
    const piece = this.gameState.game.board[pos.x][pos.y];
    return piece && piece.color === getTrait(this.gameState.game);
  }

  hover(domX: number, domY: number) {
    const pos = coordinateAdapter.fromDomToGrid({ x: domX, y: domY });
    if (this.isHoveringPiecePlayablePiece(pos)) {
      this.cssAdapter.changeCursor("grab");
    } else {
      this.cssAdapter.changeCursor("default");
    }
  }

  playMove(move: Move) {
    applyMove(this.gameState.game, move);
    this.getTimerByColor(getTrait(this.gameState.game)).stop();

    if (!isCastle(move)) {
      move.piece.hasMoved = true;
    }

    this.playAudioForMove(move);

    if (
      this.chessEngine.isCheckMate(
        this.gameState.game,
        getOpponentColor(getTrait(this.gameState.game)),
      )
    ) {
      this.dialogAdapter.show(
        `${getTrait(this.gameState.game)} won`,
        "by checkmate",
      );
      this.audioAdapter.play("end");
    } else if (
      this.chessEngine.isStaleMate(
        this.gameState.game,
        getOpponentColor(getTrait(this.gameState.game)),
      )
    ) {
      this.dialogAdapter.show(`Draw`, "by stalemate");
      this.audioAdapter.play("end");
    } else {
      this.getTimerByColor(
        getOpponentColor(getTrait(this.gameState.game)),
      ).start();
    }
  }

  playAudioForMove(move: Move) {
    if (isCastle(move)) {
      this.audioAdapter.play("castle");
    } else if (move.capture) {
      this.audioAdapter.play("capture");
    } else {
      this.audioAdapter.play("move");
    }
  }

  undoMove() {
    if (this.gameState.game.moves.length < 1) {
      return;
    }
    const move = goToPreviousMove(this.gameState.game);
    if (!move) {
      return;
    }

    this.playAudioForMove(move);
  }

  nextMove() {}

  getTimerByColor(color: Color) {
    if (color === "black") return this.blackTimer;
    if (color === "white") return this.whiteTimer;
    throw new Error(`invalid color for timer ${color}`);
  }

  loseOnTime(color: Color) {
    this.audioAdapter.play("end");
    this.dialogAdapter.show(`${color} won `, "on time");
  }

  destroy() {
    this.dialogAdapter.destroy();
  }
}
