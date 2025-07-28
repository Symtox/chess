import { rookMoveChecker } from "./rook-move-checker";
import { pawnMoveChecker } from "./pawn-move-checker";
import { knightMoveChecker } from "./knight-move-checker";
import { bishopMoveChecker } from "./bishop-move-checker";
import { kingMoveChecker } from "./king-move-checker";
import { queenMoveChecker } from "./queen-move-checker";
import { PieceType } from "@/types";
import { MoveValidator } from "@/game/engine/move-checkers/move-checker";

export class MoveCheckerFactory {
  getInstance(type: PieceType): MoveValidator {
    switch (type) {
      case "rook":
        return rookMoveChecker;
      case "pawn":
        return pawnMoveChecker;
      case "knight":
        return knightMoveChecker;
      case "bishop":
        return bishopMoveChecker;
      case "king":
        return kingMoveChecker;
      case "queen":
        return queenMoveChecker;
      default:
        throw new Error("");
    }
  }
}

export const moveCheckFactory = new MoveCheckerFactory();
