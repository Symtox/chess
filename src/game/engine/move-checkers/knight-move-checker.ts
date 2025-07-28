import { MoveChecker, MoveValidator } from "./move-checker";
import { Move } from "@/types";
import { Coordinate, Piece } from "@/types";
import { Grid } from "@/game/models/grid";

export class KnightMoveChecker extends MoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    return this.getAllKnightMovesFromPosition(piece, pos, grid);
  }

  getAllKnightMovesFromPosition(piece: Piece, pos: Coordinate, grid: Grid) {
    const moves: (Move | undefined)[] = [];
    const moveLength = 2,
      moveWidth = 1;

    for (let xDirection = -1; xDirection <= 1; xDirection += 2) {
      for (let yDirection = -1; yDirection <= 1; yDirection += 2) {
        const movePos = {
          x: pos.x + moveWidth * xDirection,
          y: pos.y + moveLength * yDirection,
        };
        const invertedMovePos = {
          x: pos.x + moveLength * xDirection,
          y: pos.y + moveWidth * yDirection,
        };

        moves.push(this.computeKnightMove(piece, pos, movePos, grid));
        moves.push(this.computeKnightMove(piece, pos, invertedMovePos, grid));
      }
    }
    return moves.filter((move) => move !== undefined);
  }

  computeKnightMove(
    piece: Piece,
    oldPos: Coordinate,
    newPos: Coordinate,
    grid: Grid,
  ): Move | undefined {
    if (
      !this.isValidBoardCoordinate(newPos.x, newPos.y) ||
      !this.isSquareAllyFree(newPos, piece.color, grid)
    ) {
      return;
    }

    let capture;
    if (this.isCapture(newPos, piece, grid)) {
      capture = {
        piece: grid.getPiece(newPos) as Piece,
        x: newPos.x,
        y: newPos.y,
      };
    }

    return {
      from: oldPos,
      to: newPos,
      piece: piece,
      type: "normal",
      capture: capture,
    };
  }
}

export const knightMoveChecker = new KnightMoveChecker();
