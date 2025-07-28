import config from "../../models/config.json";
import {MoveChecker, MoveValidator} from "./move-checker";
import {Coordinate, NormalMove, Piece} from "@/types";
import {Move} from "@/types";
import {Grid} from "@/game/models/grid";

export class RookMoveChecker extends MoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, grid: Grid) {
    const moves = []
    //TOP
    for (let delta = 1; delta <= pos.y; delta++) {
      const currMove: NormalMove = {
        from: pos,
        to: { x: pos.x, y: pos.y - delta},
        piece,
        type: 'normal',
      }
      if(this.isCapture(currMove.to, piece, grid)) {
        currMove.capture = {
          piece: grid.getPiece(currMove.to) as Piece,
          x: currMove.to.x,
          y: currMove.to.y
        }
        moves.push(currMove)

        break;
      }

      if(!this.isSquareAllyFree(currMove.to, piece.color, grid)) {
        break;
      }
      moves.push(currMove)
    }
    //LEFT

    for (let delta = 1; delta <= pos.x; delta++) {
      const to = {
        x: pos.x - delta,
        y: pos.y
      }
      const currMove: NormalMove = {
        from: pos,
        to,
        piece,
        type: 'normal'
      }
      if(this.isCapture(currMove.to, piece, grid)) {
        currMove.capture = {
          piece: grid.getPiece(currMove.to) as Piece,
          x: to.x,
          y: to.y
        }
        moves.push(currMove)

        break;
      }

      if(!this.isSquareAllyFree(currMove.to, piece.color, grid)) {
        break;
      }
      moves.push(currMove)
    }

    //BOTTOM
    for (let delta = 1; delta < config.tileCount - pos.y; delta++) {
      const currMove: Move = {
        from: pos,
        to: { x: pos.x, y: pos.y + delta },
        piece,
        type: 'normal',
        capture: undefined
      }

      if(this.isCapture(currMove.to, piece, grid)) {
        currMove.capture = {
          piece: grid.getPiece(currMove.to) as Piece,
          x: currMove.to.x,
          y: currMove.to.y
        }
        moves.push(currMove)

        break;
      }

      if(!this.isSquareAllyFree(currMove.to, piece.color, grid)) {
        break;
      }
      moves.push(currMove)
    }

    //RIGHT
    for (let delta = 1; delta < config.tileCount - pos.x; delta++) {

      const currMove: Move = {
        from: pos,
        to: {
          x: pos.x + delta,
          y: pos.y
        },
        piece,
        type: 'normal'
      }
      if(this.isCapture(currMove.to, piece, grid)) {
        currMove.capture = {
          piece: grid.getPiece(currMove.to) as Piece,
          x: currMove.to.x,
          y: currMove.to.y
        }
        moves.push(currMove)

        break;
      }

      if(!this.isSquareAllyFree(currMove.to, piece.color, grid)) {
        break;
      }
      moves.push(currMove)
    }

    return moves
  }

}

export const rookMoveChecker = new RookMoveChecker()