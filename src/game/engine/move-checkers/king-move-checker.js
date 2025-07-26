import config from '/src/game/models/config.json'
import {MoveChecker} from "./move-checker.js";
import {Coordinate} from "../../../utils/coordinate.js";
import {Move} from "./move.js";
import {Castle} from "../moves/castle.js";

export class KingMoveChecker extends MoveChecker {
  getPossibleMoves(piece, pos, grid) {
    return [
      ...this.getBasicMoves(piece, pos, grid),
      ...this.getCastleMoves(piece, pos, grid)
    ]
  }

  getBasicMoves(piece, pos, grid) {
    const moves = []
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const movePos = new Coordinate(pos.x + dx, pos.y + dy)
        if(
          !this.isValidBoardCoordinate(movePos.x, movePos.y)
          || !this.isSquareAllyFree(movePos, piece.color, grid)
        ) {
          continue
        }


        const move = new Move(
          pos,
          movePos,
          piece,
        )

        if(this.isCapture(movePos, piece, grid)) {
          move.capture = {
            x: movePos.x,
            y: movePos.y,
            piece: grid.getPiece(movePos)
          }
        }

        moves.push(move)
      }
    }

    return moves
  }

  getCastleMoves(piece, pos, grid) {
    const moves = []
    if(
      this.isSquareFree(1, pos.y, grid)
      && this.isSquareFree(2, pos.y, grid)
      && this.isSquareFree(3, pos.y, grid)
      && grid.getPiece({ x: 0, y: pos.y })
      && grid.getPiece({ x: 0, y: pos.y }).type === "ROOK"
      && !grid.getPiece({ x: 0, y: pos.y }).hasMoved
      && grid.getPiece({ x: 4, y: pos.y })
      && grid.getPiece({ x: 4, y: pos.y }).type === "KING"
      && !grid.getPiece({ x: 4, y: pos.y }).hasMoved
    ) {
      moves.push(new Castle(piece.color, "long"))
    }

    if(
      this.isSquareFree(5, pos.y, grid)
      && this.isSquareFree(6, pos.y, grid)
      && grid.getPiece({ x: 7, y: pos.y })
      && grid.getPiece({ x: 7, y: pos.y }).type === "ROOK"
      && !grid.getPiece({ x: 7, y: pos.y }).hasMoved
      && grid.getPiece({ x: 4, y: pos.y })
      && grid.getPiece({ x: 4, y: pos.y }).type === "KING"
      && !grid.getPiece({ x: 4, y: pos.y }).hasMoved
    ) {
      moves.push(new Castle(piece.color, "short"))
    }

    return moves
  }


}

export const kingMoveChecker = new KingMoveChecker()