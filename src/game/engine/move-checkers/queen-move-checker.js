import {MoveChecker} from "./move-checker.js";
import {bishopMoveChecker} from "./bishop-move-checker.js";
import {rookMoveChecker} from "./rook-move-checker.js";

export class QueenMoveChecker extends MoveChecker {
  constructor() {
    super();
  }

  getPossibleMoves(piece, pos, grid) {
    return [
      ...bishopMoveChecker.getPossibleMoves(piece, pos, grid),
      ...rookMoveChecker.getPossibleMoves(piece, pos, grid)
    ]
  }
}

export const queenMoveChecker = new QueenMoveChecker()