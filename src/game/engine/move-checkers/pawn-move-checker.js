import {MoveChecker} from "./move-checker.js";
import {Move} from "./move.js";
import {Coordinate} from "../../../utils/coordinate.js";
import config from '/src/game/models/config.json'
import {Castle} from "../moves/castle.js";

export class PawnMoveChecker extends MoveChecker {
  getPossibleMoves(piece, pos, grid, lastMove) {
    return [
      ...this.getEnPassantMoves(piece, pos.x, pos.y, grid, lastMove),
      ...this.getForwardMoves(piece, pos.x, pos.y, grid, lastMove),
      ...this.getCaptureMoves(piece, pos.x, pos.y, grid, lastMove)
    ]
  }

  isPromotionSquare(pos) {
    return pos.y === 0 ||pos.y === config.tileCount
  }

  getForwardMoves(piece, x, y, grid) {
    const moves = []
    const yIncrement = piece.color === "black" ? 1 : -1

    const oldPos = new Coordinate(x, y)

    if(
      this.isValidBoardCoordinate(x, y + yIncrement, piece, grid)
      && this.isSquareFree(x, y + yIncrement, grid)
    ) {
      const newPos = new Coordinate(x, y + yIncrement)
      moves.push(
        new Move( oldPos, newPos, piece )
      )
    }

    if(
      piece.color === "black"
      && y === 1
      && this.isSquareFree(x, 2, grid)
      && this.isSquareFree(x, 3, grid)
    ) {
      const newPos = new Coordinate(x, 3)
      moves.push(
        new Move( oldPos, newPos, piece )
      )
    }

    if(
      piece.color === "white"
      && y === 6
      && this.isSquareFree(x, 5, grid)
      && this.isSquareFree(x, 4, grid)
    ) {
      const newPos = new Coordinate(x, 4)
      moves.push(new Move(oldPos, newPos, piece))
    }
    return moves
  }

  getCaptureMoves(piece, x, y, grid) {
    const yIncrement = piece.color === "black" ? 1 : -1
    const moves = []


    for(let dir = -1; dir <= 1; dir += 2) {
      const oldPos = new Coordinate(x, y)
      const captureCoords = new Coordinate(x + dir, y + yIncrement)
      if(
        this.isValidBoardCoordinate(captureCoords.x, captureCoords.y)
        && this.isCapture(captureCoords, piece, grid)
      ) {
        moves.push(new Move(
          oldPos,
          captureCoords,
          piece,
          {
            piece: grid.getPiece(captureCoords),
            x: captureCoords.x,
            y: captureCoords.y
          }
        ))
      }
    }

    return moves
  }

  getEnPassantMoves(piece, x, y, grid, lastMove) {
    const yIncrement = piece.color === "black" ? 1 : -1
    if(
      !lastMove
      || lastMove instanceof Castle
      || lastMove.piece.type !== "PAWN"
      || Math.abs(lastMove.from.y - lastMove.to.y) !== 2
      || Math.abs(lastMove.to.x - x) !== 1
      || lastMove.to.y !== y
    ) {
      return []
    }

    for(let dir = -1; dir <= 1; dir += 2) {
      if(Math.abs(lastMove.to.x - x * dir) === 1) {
        return [new Move(
          new Coordinate(x, y),
          new Coordinate(lastMove.to.x, y + yIncrement),
          piece,
          {
            piece: lastMove.piece,
            x: lastMove.to.x,
            y: lastMove.to.y
          }
        )]
      }
    }


    return []
  }
}

export const pawnMoveChecker = new PawnMoveChecker()