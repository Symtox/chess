import { MoveChecker, MoveValidator } from "./move-checker";
import { Coordinate, NormalMove } from "@/types";
import { Piece } from "@/types";
import { Grid } from "@/game/models/grid";

export class BishopMoveChecker extends MoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    return [
      ...this.getTopLeftMoves(piece, pos, grid),
      ...this.getBottomLeftMoves(piece, pos, grid),
      ...this.getTopRightMoves(piece, pos, grid),
      ...this.getBottomRightMoves(piece, pos, grid),
    ];
  }

  getTopLeftMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    const moves = [];
    for (
      let delta = 1;
      this.isValidBoardCoordinate(pos.x - delta, pos.y - delta);
      delta++
    ) {
      const newPos = { x: pos.x - delta, y: pos.y - delta };

      if (!this.isSquareAllyFree(newPos, piece.color, grid)) {
        return moves;
      }
      const currentMove: NormalMove = {
        from: pos,
        to: newPos,
        piece,
        type: "normal",
      };
      if (this.isCapture(newPos, piece, grid)) {
        currentMove.capture = {
          x: newPos.x,
          y: newPos.y,
          piece: grid.getPiece(newPos) as Piece,
        };
        return [...moves, currentMove];
      }

      moves.push(currentMove);
    }
    return moves;
  }

  getBottomLeftMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    const moves = [];
    for (
      let delta = 1;
      this.isValidBoardCoordinate(pos.x - delta, pos.y + delta);
      delta++
    ) {
      const newPos = { x: pos.x - delta, y: pos.y + delta };

      if (!this.isSquareAllyFree(newPos, piece.color, grid)) {
        return moves;
      }
      const currentMove: NormalMove = {
        from: pos,
        to: newPos,
        piece,
        type: "normal",
      };
      if (this.isCapture(newPos, piece, grid)) {
        currentMove.capture = {
          x: newPos.x,
          y: newPos.y,
          piece: grid.getPiece(newPos) as Piece,
        };
        return [...moves, currentMove];
      }

      moves.push(currentMove);
    }
    return moves;
  }

  getBottomRightMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    const moves = [];
    for (
      let delta = 1;
      this.isValidBoardCoordinate(pos.x + delta, pos.y + delta);
      delta++
    ) {
      const newPos = { x: pos.x + delta, y: pos.y + delta };

      if (!this.isSquareAllyFree(newPos, piece.color, grid)) {
        return moves;
      }
      const currentMove: NormalMove = {
        from: pos,
        to: newPos,
        piece,
        type: "normal",
      };
      if (this.isCapture(newPos, piece, grid)) {
        currentMove.capture = {
          x: newPos.x,
          y: newPos.y,
          piece: grid.getPiece(newPos) as Piece,
        };
        return [...moves, currentMove];
      }

      moves.push(currentMove);
    }
    return moves;
  }

  getTopRightMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    const moves = [];
    for (
      let delta = 1;
      this.isValidBoardCoordinate(pos.x + delta, pos.y - delta);
      delta++
    ) {
      const newPos = {
        x: pos.x + delta,
        y: pos.y - delta,
      };

      if (!this.isSquareAllyFree(newPos, piece.color, grid)) {
        return moves;
      }
      const currentMove: NormalMove = {
        from: pos,
        to: newPos,
        piece,
        type: "normal",
      };
      if (this.isCapture(newPos, piece, grid)) {
        currentMove.capture = {
          x: newPos.x,
          y: newPos.y,
          piece: grid.getPiece(newPos) as Piece,
        };
        return [...moves, currentMove];
      }

      moves.push(currentMove);
    }
    return moves;
  }
}

export const bishopMoveChecker = new BishopMoveChecker();
