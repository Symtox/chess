import {Grid} from "./grid.js";
import {Castle} from "../engine/moves/castle.js";
export class GameState {

  constructor() {
    this.grid = new Grid()
    this.selection = undefined
    this.moves = []
  }

  getSelection() {
    return this.selection
  }

  setSelection(selection, allowedMoves) {
    this.selection = selection
    this.allowedMoves = allowedMoves
  }

  goToPreviousMove() {
    const move = this.moves.pop()
    this.grid.undoMove(move)
    if(!(move instanceof Castle)) {
      move.piece.hasMoved = false;
    }

    return move
  }

  getMoveCount() {
    return this.moves.length
  }

  applyMove(move) {
    this.grid.applyMove(move)
    this.moves.push(move)
  }

  getLastMove() {
    return this.moves[this.moves.length - 1]
  }

  getTrait() {
    return this.moves.length % 2 === 0 ? "white" : "black"
  }
}