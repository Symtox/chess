import {Grid} from "./grid";
import {isCastle, Move} from "@/types";
export class GameState {
  public grid: Grid;
  private selection: any;
  private moves: Move[];
  public allowedMoves: Move[] = [];


  constructor() {
    this.grid = new Grid()
    this.selection = undefined
    this.moves = []
  }

  getSelection() {
    return this.selection
  }

  setSelection(selection: any, allowedMoves: Move[]) {
    this.selection = selection
    this.allowedMoves = allowedMoves
  }

  goToPreviousMove() {
    const move = this.moves.pop()
    if(!move) return;

    this.grid.undoMove(move)
    if(!isCastle(move)) {
      move.piece.hasMoved = false;
    }

    return move
  }

  getMoveCount() {
    return this.moves.length
  }

  applyMove(move: Move) {
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