import config from "@/game/models/config.json";
import { Capture, Coordinate, Move } from "@/types";
import { Grid } from "@/game/models/grid";
import { Color } from "@/types";
import { Piece } from "@/types";

export interface MoveValidator {
  getPossibleMoves(
    piece: Piece,
    pos: Coordinate,
    grid: Grid,
    lastMove?: Move,
  ): Move[];
}

export class MoveChecker {
  isValidBoardCoordinate(x: number, y: number) {
    return x >= 0 && x < config.tileCount && y >= 0 && y < config.tileCount;
  }

  isCapture(pos: Coordinate, piece: Piece, grid: Grid) {
    const cell = grid.getPiece(pos);
    return !!cell && cell.color !== piece.color;
  }

  getCapture(pos: Coordinate, piece: Piece, grid: Grid): Capture | undefined {
    if (!this.isCapture(pos, piece, grid)) {
      return undefined;
    }

    const cell = grid.getPiece(pos);
    if (!cell) {
      return undefined;
    }

    return {
      piece: cell,
      y: pos.y,
      x: pos.x,
    };
  }

  isSquareFree(x: number, y: number, grid: Grid) {
    return !grid.getPiece({ x, y });
  }

  isSquareAllyFree(pos: Coordinate, color: Color, grid: Grid) {
    const cell = grid.getPiece(pos);
    return !cell || cell.color !== color;
  }
}
