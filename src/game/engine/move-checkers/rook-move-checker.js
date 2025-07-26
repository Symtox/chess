import config from "../../models/config.json";
import {MoveChecker} from "./move-checker.js";
import {Coordinate} from "../../../utils/coordinate.js";
import {Move} from "./move.js";

export class RookMoveChecker extends MoveChecker {
  getPossibleMoves(piece, pos, grid) {
    const moves = []
    //TOP
    for (let delta = 1; delta <= pos.y; delta++) {
      const currMove = new Move(
        pos,
        new Coordinate(pos.x, pos.y - delta),
        piece
      )
      if(this.isCapture(currMove.to, piece, grid)) {
        currMove.capture = {
          piece: grid.getPiece(currMove.to),
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
      const currMove = new Move(
        pos,
        new Coordinate(pos.x - delta, pos.y),
        piece
      )
      if(this.isCapture(currMove.to, piece, grid)) {
        currMove.capture = {
          piece: grid.getPiece(currMove.to),
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

    //BOTTOM
    for (let delta = 1; delta < config.tileCount - pos.y; delta++) {
      const currMove = new Move(
        pos,
        new Coordinate(pos.x, pos.y + delta),
        piece
      )
      if(this.isCapture(currMove.to, piece, grid)) {
        currMove.capture = {
          piece: grid.getPiece(currMove.to),
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
      const currMove = new Move(
        pos,
        new Coordinate(pos.x + delta, pos.y),
        piece
      )
      if(this.isCapture(currMove.to, piece, grid)) {
        currMove.capture = {
          piece: grid.getPiece(currMove.to),
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