import {MoveChecker} from "./move-checker.js";
import {Coordinate} from "../../../utils/coordinate.js";
import {Move} from "./move.js";

export class BishopMoveChecker extends MoveChecker {
  getPossibleMoves(piece, pos, grid) {
    return [
      ...this.getTopLeftMoves(piece, pos, grid),
      ...this.getBottomLeftMoves(piece, pos, grid),
      ...this.getTopRightMoves(piece, pos, grid),
      ...this.getBottomRightMoves(piece, pos, grid)
    ]
  }

  getTopLeftMoves(piece, pos, grid) {
    const moves = []
    for(let delta = 1; this.isValidBoardCoordinate(pos.x - delta, pos.y - delta); delta++) {
      const newPos = new Coordinate(pos.x - delta, pos.y - delta)

      if(!this.isSquareAllyFree(newPos, piece.color, grid)) {
        return moves
      }
      const currentMove = new Move(
        pos,
        newPos,
        piece
      )
      if(this.isCapture(newPos, piece, grid)) {
        currentMove.capture = {
          x: newPos.x,
          y: newPos.y,
          piece: grid.getPiece(newPos)
        }
        return [...moves, currentMove]
      }

      moves.push(currentMove)

    }
    return moves
  }

  getBottomLeftMoves(piece, pos, grid) {
    const moves = []
    for(let delta = 1; this.isValidBoardCoordinate(pos.x - delta, pos.y + delta); delta++) {
      const newPos = new Coordinate(pos.x - delta, pos.y + delta)

      if(!this.isSquareAllyFree(newPos, piece.color, grid)) {
        return moves
      }
      const currentMove = new Move(
        pos,
        newPos,
        piece
      )
      if(this.isCapture(newPos, piece, grid)) {
        currentMove.capture = {
          x: newPos.x,
          y: newPos.y,
          piece: grid.getPiece(newPos)
        }
        return [...moves, currentMove]
      }

      moves.push(currentMove)

    }
    return moves
  }

  getBottomRightMoves(piece, pos, grid) {
    const moves = []
    for(let delta = 1; this.isValidBoardCoordinate(pos.x + delta, pos.y + delta); delta++) {
      const newPos = new Coordinate(pos.x + delta, pos.y + delta)

      if(!this.isSquareAllyFree(newPos, piece.color, grid)) {
        return moves
      }
      const currentMove = new Move(
        pos,
        newPos,
        piece
      )
      if(this.isCapture(newPos, piece, grid)) {
        currentMove.capture = {
          x: newPos.x,
          y: newPos.y,
          piece: grid.getPiece(newPos)
        }
        return [...moves, currentMove]
      }

      moves.push(currentMove)

    }
    return moves
  }


  getTopRightMoves(piece, pos, grid) {
    const moves = []
    for(let delta = 1; this.isValidBoardCoordinate(pos.x + delta, pos.y - delta); delta++) {
      const newPos = new Coordinate(pos.x + delta, pos.y - delta)

      if(!this.isSquareAllyFree(newPos, piece.color, grid)) {
        return moves
      }
      const currentMove = new Move(
        pos,
        newPos,
        piece
      )
      if(this.isCapture(newPos, piece, grid)) {
        currentMove.capture = {
          x: newPos.x,
          y: newPos.y,
          piece: grid.getPiece(newPos)
        }
        return [...moves, currentMove]
      }

      moves.push(currentMove)
    }
    return moves
  }
}

export const bishopMoveChecker = new BishopMoveChecker()