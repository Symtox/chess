import {rookMoveChecker} from "./rook-move-checker.js";
import {pawnMoveChecker} from "./pawn-move-checker.js";
import {knightMoveChecker} from "./knight-move-checker.js";
import {bishopMoveChecker} from "./bishop-move-checker.js";
import {kingMoveChecker} from "./king-move-checker.js";
import {queenMoveChecker} from "./queen-move-checker.js";

export class MoveCheckerFactory {
  getInstance(type) {
    switch(type) {
      case "ROOK":
        return rookMoveChecker
      case "PAWN":
        return pawnMoveChecker
      case "KNIGHT":
        return knightMoveChecker
      case "BISHOP":
        return bishopMoveChecker
      case "KING":
        return kingMoveChecker
      case "QUEEN":
        return queenMoveChecker
      default: throw new Error('')
    }
  }
}

export const moveCheckFactory = new MoveCheckerFactory()