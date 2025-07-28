import {MoveChecker, MoveValidator} from "./move-checker";
import config from '@/game/models/config.json'
import {Grid} from "@/game/models/grid";
import {Coordinate, isCastle, Move} from "@/types";
import {Piece} from "@/types";

export class PawnMoveChecker extends MoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, grid: Grid, lastMove: Move) {
    return [
      ...this.getEnPassantMoves(piece, pos, grid, lastMove),
      ...this.getForwardMoves(piece, pos, grid),
      ...this.getCaptureMoves(piece, pos, grid)
    ]
  }

  isPromotionSquare(pos: Coordinate) {
    return pos.y === 0 || pos.y === config.tileCount
  }

  getForwardMoves(piece: Piece, pos: Coordinate, grid: Grid): Move[] {
    const moves: Move[] = []
    const yIncrement = piece.color === "black" ? 1 : -1


    if(
      this.isValidBoardCoordinate(pos.x, pos.y + yIncrement)
      && this.isSquareFree(pos.x, pos.y + yIncrement, grid)
    ) {
      const newPos = { x: pos.x, y: pos.y + yIncrement }
      moves.push(
        {
          from: pos,
          to: newPos,
          piece: piece,
          type: 'normal'
        }
      )
    }

    if(
      piece.color === "black"
      && pos.y === 1
      && this.isSquareFree(pos.x, 2, grid)
      && this.isSquareFree(pos.x, 3, grid)
    ) {
      const newPos = { x: pos.x, y: 3 }
      moves.push({
        from: pos,
        to: newPos,
        piece: piece,
        type: 'normal'
      })
    }

    if(
      piece.color === "white"
      && pos.y === 6
      && this.isSquareFree(pos.x, 5, grid)
      && this.isSquareFree(pos.x, 4, grid)
    ) {
      const newPos = { x: pos.x, y: 4 }
      moves.push({
        from: pos,
        to: newPos,
        piece: piece,
        type: 'normal'
      })
    }
    return moves
  }

  getCaptureMoves(piece: Piece, pos: Coordinate, grid: Grid): Move[] {
    const yIncrement = piece.color === "black" ? 1 : -1
    const moves: Move[] = []


    for(let dir = -1; dir <= 1; dir += 2) {
      const captureCoords = { x: pos.x + dir, y: pos.y + yIncrement }
      if(
        this.isValidBoardCoordinate(captureCoords.x, captureCoords.y)
        && this.isCapture(captureCoords, piece, grid)
      ) {
        moves.push({
          from: pos,
          to: captureCoords,
          piece: piece,
          type: 'normal',
          capture: {
            piece: grid.getPiece(captureCoords) as Piece,
            x: captureCoords.x,
            y: captureCoords.y
          }
        })
      }
    }

    return moves
  }

  getEnPassantMoves(piece: Piece, { x, y }: Coordinate, grid: Grid, lastMove?: Move): Move[] {
    const yIncrement = piece.color === "black" ? 1 : -1
    if(
      !lastMove
      || isCastle(lastMove)
      || lastMove.piece.type !== "pawn"
      || Math.abs(lastMove.from.y - lastMove.to.y) !== 2
      || Math.abs(lastMove.to.x - x) !== 1
      || lastMove.to.y !== y
    ) {
      return [] as Move[]
    }

    for(let dir = -1; dir <= 1; dir += 2) {
      if(Math.abs(lastMove.to.x - x * dir) === 1) {
        return [{
          from: { x: x, y: y },
          to: { x: lastMove.to.x, y: y + yIncrement  },
          piece: piece,
          type: 'normal',
          capture: {
            piece: lastMove.piece,
            x: lastMove.to.x,
            y: lastMove.to.y
          }
        } as Move]
      }
    }


    return []
  }
}

export const pawnMoveChecker = new PawnMoveChecker()