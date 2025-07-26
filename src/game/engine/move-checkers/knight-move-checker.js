import {MoveChecker} from "./move-checker.js";
import {Move} from "./move.js";
import {Coordinate} from "../../../utils/coordinate.js";

export class KnightMoveChecker extends MoveChecker {
  getPossibleMoves(piece, pos, grid) {
    return this.getAllKnightMovesFromPosition(piece, pos, grid)
  }

  getAllKnightMovesFromPosition(piece, pos, grid) {
    const moves = []
    const moveLength = 2, moveWidth = 1

    for (let xDirection = -1; xDirection <= 1; xDirection += 2) {
      for (let yDirection = -1; yDirection <= 1; yDirection += 2) {
        const movePos = new Coordinate(pos.x + moveWidth * xDirection, pos.y + moveLength * yDirection)
        const invertedMovePos = new Coordinate(pos.x + moveLength * xDirection, pos.y + moveWidth * yDirection)

        moves.push(this.computeKnightMove(piece, pos, movePos, grid))
        moves.push(this.computeKnightMove(piece, pos, invertedMovePos, grid))
      }
    }
    return moves.filter((move) => move !== undefined)
  }


  computeKnightMove(piece, oldPos, newPos, grid) {
    if(
      !this.isValidBoardCoordinate(newPos.x, newPos.y)
      || !this.isSquareAllyFree(newPos, piece.color, grid)
    ) {
      return
    }

    let capture
    if(this.isCapture(newPos, piece, grid)) {
      capture = {
        piece: grid.getPiece(newPos),
        x: newPos.x,
        y: newPos.y
      }
    }

    return new Move(
      oldPos,
      newPos,
      piece,
      capture
    )
  }
}

export const knightMoveChecker = new KnightMoveChecker()