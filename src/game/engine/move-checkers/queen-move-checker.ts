import { MoveChecker, MoveValidator } from "./move-checker";
import { bishopMoveChecker } from "./bishop-move-checker";
import { rookMoveChecker } from "./rook-move-checker";
import { Coordinate, Piece } from "@/types";
import { Grid } from "@/game/models/grid";

export class QueenMoveChecker extends MoveChecker implements MoveValidator {
  constructor() {
    super();
  }

  getPossibleMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    return [
      ...bishopMoveChecker.getPossibleMoves(piece, pos, grid),
      ...rookMoveChecker.getPossibleMoves(piece, pos, grid),
    ];
  }
}

export const queenMoveChecker = new QueenMoveChecker();
