import {coordinateAdapter} from "../rendering/positions";
import {GameState} from "@/game/models/game-state";
import {ChessEngine} from "@/game/engine/chess-engine";
import {CssAdapter} from "@/game/adapters/css-adapter";
import {AudioAdapter} from "@/game/adapters/audio-adapter";
import {Timer} from "@/game/models/timer";
import {EndGameDialogAdapter} from "@/game/adapters/end-game-dialog-adapter";
import {Color, Coordinate, getMoveIndicationCoordinates, getOpponentColor, isCastle, Move} from "@/types";
import {ClockAdapter} from "@/game/adapters/clock-adapter";

export class GameEngine {

  private gameState: GameState
  private chessEngine: ChessEngine
  private cssAdapter: CssAdapter
  private audioAdapter: AudioAdapter
  private whiteTimer: any
  private blackTimer: any
  private dialogAdapter: any


  constructor(
    gameState: GameState,
    chessEngine: ChessEngine,
    cssAdapter: CssAdapter,
    audioAdapter: AudioAdapter,
    whiteTimer: Timer,
    blackTimer: Timer,
    dialogAdapter: EndGameDialogAdapter
  ) {
    this.gameState = gameState
    this.chessEngine = chessEngine
    this.cssAdapter = cssAdapter
    this.audioAdapter = audioAdapter
    this.whiteTimer = whiteTimer
    this.blackTimer = blackTimer

    this.dialogAdapter = dialogAdapter

    this.whiteTimer.onEnd(() => this.loseOnTime('white'))
    this.blackTimer.onEnd(() => this.loseOnTime('black'))
  }

  grab(dx: number, dy: number) {
    const canvasPos = coordinateAdapter.fromDomToCanvas({ x: dx, y: dy})
    const { x, y } = coordinateAdapter.fromCanvasToGrid(canvasPos)
    const pos = { x: x, y: y }
    const piece = this.gameState.grid.getPiece(pos)
    if(piece && piece.color === this.gameState.getTrait()) {
      this.cssAdapter.changeCursor('grabbing')
      this.gameState.setSelection({
        x: canvasPos.x,
        y: canvasPos.y,
        initialPosX: x,
        initialPosY: y,
        piece: piece
      }, this.chessEngine.computeAllowedMoves(piece, this.gameState.grid, pos, this.gameState.getLastMove()))
    }
  }

  move(x: number, y: number) {
    if(!this.gameState.getSelection()) {
      return
    }

    const canvasPos = coordinateAdapter.fromDomToCanvas({ x: x, y: y })
    this.gameState.getSelection().x = canvasPos.x
    this.gameState.getSelection().y = canvasPos.y

  }

  discardSelection() {
    this.gameState.setSelection( undefined, [])
  }

  drop(dx: number, dy: number) {
    if(!this.gameState.getSelection()) return;

    const pos = coordinateAdapter.fromDomToGrid({ x: dx, y: dy})

    const move = this.gameState.allowedMoves.find(move => getMoveIndicationCoordinates(move).x === pos.x && getMoveIndicationCoordinates(move).y === pos.y)
    if(move) {
      this.playMove(move)
    }


    if(this.isHoveringPiecePlayablePiece(pos) ) {
      this.cssAdapter.changeCursor('grab')
    } else {
      this.cssAdapter.changeCursor('default')
    }

    this.gameState.setSelection(undefined, []);
  }


  isHoveringPiecePlayablePiece(pos: Coordinate) {
    return !!this.gameState.grid.getPiece(pos)
      && this.gameState.grid.getPiece(pos)?.color === this.gameState.getTrait()
  }


  hover(domX: number, domY: number) {
    const pos = coordinateAdapter.fromDomToGrid({ x: domX, y: domY})
    if(this.isHoveringPiecePlayablePiece(pos)) {
      this.cssAdapter.changeCursor('grab')
    } else {
      this.cssAdapter.changeCursor('default')
    }
  }

  playMove(move: Move) {
    this.gameState.applyMove(move)
    this.getTimerByColor(this.gameState.getTrait()).stop()

    if(!isCastle(move)) {
      move.piece.hasMoved = true
    }

    this.playAudioForMove(move)

    if(this.chessEngine.isCheckMate(this.gameState.grid, getOpponentColor(this.gameState.getTrait()), this.gameState.getLastMove())) {
      this.dialogAdapter.show(`${this.gameState.getTrait()} won`, 'by checkmate')
      this.audioAdapter.play("end")
    } else if(this.chessEngine.isStaleMate(this.gameState.grid, getOpponentColor(this.gameState.getTrait()), this.gameState.getLastMove())){
      this.dialogAdapter.show(`Draw`, 'by stalemate')
      this.audioAdapter.play("end")
    } else {
      this.getTimerByColor(getOpponentColor(this.gameState.getTrait())).start()
    }
  }

  playAudioForMove(move: Move) {
    if(isCastle(move)) {
      this.audioAdapter.play("castle")
    } else if(move.capture) {
      this.audioAdapter.play("capture")
    } else {
      this.audioAdapter.play("move")
    }
  }

  undoMove() {
    if(this.gameState.getMoveCount() < 1) {
      return
    }
    const move = this.gameState.goToPreviousMove()
    if(!move) {
      return
    }

    this.playAudioForMove(move)
  }
  
  nextMove() {

  }


  getTimerByColor(color: Color) {
    if(color === "black")
      return this.blackTimer
    if(color === "white")
      return this.whiteTimer
    throw new Error(`invalid color for timer ${color}`)
  }

  loseOnTime(color: Color) {
    this.audioAdapter.play("end")
    this.dialogAdapter.show(`${color} won `, 'on time')
  }

  destroy() {
    this.dialogAdapter.destroy()
  }
}