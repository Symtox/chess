import {coordinateAdapter} from "../rendering/positions.js";
import {Coordinate} from "../../utils/coordinate.js";
import {Castle} from "./moves/castle.js";
import {getOpponentColor} from "../../utils/utils.js";

export class GameEngine {
  constructor(gameState, chessEngine, cssAdapter, audioAdapter, whiteTimer, blackTimer, dialogAdapter) {
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

  grab(dx, dy) {
    const canvasPos = coordinateAdapter.fromDomToCanvas({ x: dx, y: dy})
    const { x, y } = coordinateAdapter.fromCanvasToGrid(canvasPos)
    const pos = new Coordinate(x, y)
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

  move(x, y) {
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

  drop(dx, dy) {
    if(!this.gameState.getSelection()) return;

    const pos = coordinateAdapter.fromDomToGrid({ x: dx, y: dy})

    const move = this.gameState.allowedMoves.find(move => move.getMoveIndicationCoordinates().x === pos.x && move.getMoveIndicationCoordinates().y === pos.y)
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


  isHoveringPiecePlayablePiece(pos) {
    return !!this.gameState.grid.getPiece(pos) && this.gameState.grid.getPiece(pos).color === this.gameState.getTrait()
  }


  hover(domX, domY) {
    const pos = coordinateAdapter.fromDomToGrid({ x: domX, y: domY})
    if(this.isHoveringPiecePlayablePiece(pos)) {
      this.cssAdapter.changeCursor('grab')
    } else {
      this.cssAdapter.changeCursor('default')
    }
  }

  playMove(move) {
    this.gameState.applyMove(move)
    this.getTimerByColor(move.color).stop()

    if(!(move instanceof Castle)) {
      move.piece.hasMoved = true
    }

    this.playAudioForMove(move)

    if(this.chessEngine.isCheckMate(this.gameState.grid, getOpponentColor(move.color), this.gameState.getLastMove())) {
      this.dialogAdapter.show(`${move.color} won`, 'by checkmate')
      this.audioAdapter.play("end")
    } else if(this.chessEngine.isStaleMate(this.gameState.grid, getOpponentColor(move.color), this.gameState.getLastMove())){
      this.dialogAdapter.show(`Draw`, 'by stalemate')
      this.audioAdapter.play("end")
    } else {
      this.getTimerByColor(getOpponentColor(move.color)).start()
    }
  }

  playAudioForMove(move) {
    if(move.capture) {
      this.audioAdapter.play("capture")
    } else if(move instanceof Castle) {
      this.audioAdapter.play("castle")
    } else {
      this.audioAdapter.play("move")
    }
  }

  undoMove() {
    if(this.gameState.getMoveCount() < 1) {
      return
    }
    const move = this.gameState.goToPreviousMove()
    this.playAudioForMove(move)
  }
  
  nextMove() {

  }


  getTimerByColor(color) {
    if(color === "black")
      return this.blackTimer
    if(color === "white")
      return this.whiteTimer
    throw new Error(`invalid color for timer ${color}`)
  }

  loseOnTime(color) {
    this.audioAdapter.play("end")
    this.dialogAdapter.show(`${color} won `, 'on time')
  }

  destroy() {
    this.dialogAdapter.destroy()
  }
}