import { MoveValidator } from "./move-checker";
import { bishopMoveChecker } from "./bishop-move-checker";
import { rookMoveChecker } from "./rook-move-checker";
import { Coordinate, Piece } from "@/types/types";
import { Game } from "@/types/game";

export class QueenMoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, game: Game) {
    return [
      ...bishopMoveChecker.getPossibleMoves(piece, pos, game),
      ...rookMoveChecker.getPossibleMoves(piece, pos, game),
    ];
  }
}

export const queenMoveChecker = new QueenMoveChecker();
