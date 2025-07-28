import { MoveChecker, MoveValidator } from "./move-checker";
import { Coordinate, Piece } from "@/types";
import { Move } from "@/types";
import { Grid } from "@/game/models/grid";

export class KingMoveChecker extends MoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    return [
      ...this.getBasicMoves(piece, pos, grid),
      ...this.getCastleMoves(piece, pos, grid),
    ];
  }

  getBasicMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    const moves: Move[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const movePos = { x: pos.x + dx, y: pos.y + dy };
        if (
          !this.isValidBoardCoordinate(movePos.x, movePos.y) ||
          !this.isSquareAllyFree(movePos, piece.color, grid)
        ) {
          continue;
        }

        const move: Move = {
          from: pos,
          to: movePos,
          piece,
          type: "normal",
        };

        if (this.isCapture(movePos, piece, grid)) {
          move.capture = {
            x: movePos.x,
            y: movePos.y,
            piece: grid.getPiece(movePos) as Piece,
          };
        }

        moves.push(move);
      }
    }

    return moves;
  }

  getCastleMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    const moves: Move[] = [];

    const pieceInKingSlot = grid.getPiece({ x: 4, y: pos.y });
    const pieceInLeftRookSlot = grid.getPiece({ x: 0, y: pos.y });
    const pieceInRightRookSlot = grid.getPiece({ x: 7, y: pos.y });

    if (
      this.isSquareFree(1, pos.y, grid) &&
      this.isSquareFree(2, pos.y, grid) &&
      this.isSquareFree(3, pos.y, grid) &&
      pieceInLeftRookSlot &&
      pieceInLeftRookSlot.type === "rook" &&
      !pieceInLeftRookSlot.hasMoved &&
      pieceInKingSlot &&
      pieceInKingSlot.type === "king" &&
      !pieceInKingSlot.hasMoved
    ) {
      moves.push({
        type: "long",
        color: piece.color,
      });
    }

    if (
      this.isSquareFree(5, pos.y, grid) &&
      this.isSquareFree(6, pos.y, grid) &&
      pieceInRightRookSlot &&
      pieceInRightRookSlot.type === "rook" &&
      !pieceInRightRookSlot.hasMoved &&
      pieceInKingSlot &&
      pieceInKingSlot.type === "king" &&
      !pieceInKingSlot.hasMoved
    ) {
      moves.push({
        type: "short",
        color: piece.color,
      });
    }

    return moves;
  }
}

export const kingMoveChecker = new KingMoveChecker();
