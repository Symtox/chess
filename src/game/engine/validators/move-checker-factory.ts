import { rookMoveChecker } from "./rook-move-checker";
import { pawnMoveChecker } from "./pawn-move-checker";
import { knightMoveChecker } from "./knight-move-checker";
import { bishopMoveChecker } from "./bishop-move-checker";
import { kingMoveChecker } from "./king-move-checker";
import { queenMoveChecker } from "./queen-move-checker";
import { PieceType} from "@/types/types";
import { MoveValidator } from "@/game/engine/validators/move-checker";

export class MoveCheckerFactory {
  private validators: {[key in PieceType]: MoveValidator} = {
    bishop: bishopMoveChecker,
    pawn: pawnMoveChecker,
    rook: rookMoveChecker,
    knight: knightMoveChecker,
    king: kingMoveChecker,
    queen: queenMoveChecker
  }

  getInstance(type: PieceType): MoveValidator {
    return this.validators[type]
  }

  setValidator(type: PieceType, validator: MoveValidator) {
    this.validators[type] = validator
  }
}

export const moveCheckFactory = new MoveCheckerFactory();
