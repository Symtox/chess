import config from "../../models/config.json";
import { MoveValidator } from "./move-checker";
import { Coordinate, Piece } from "@/types/types";
import { Move } from "@/types/types";
import { Game } from "@/types/game";

//TODO refactor
export class RookMoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, { board }: Game) {
    const moves: Move[] = [];
    //TOP
    for (let delta = 1; delta <= pos.y; delta++) {
      const currMove: Move = {
        from: pos,
        to: {
          x: pos.x,
          y: pos.y - delta,
        },
        piece,
        type: "normal",
      };

      const cellContent = board[currMove.to.x][currMove.to.y];
      if (!cellContent) {
        moves.push(currMove);
        continue;
      }

      if (cellContent.color === piece.color) {
        break;
      }

      if (cellContent.color !== piece.color) {
        moves.push({
          ...currMove,
          capture: {
            piece: cellContent,
            x: currMove.to.x,
            y: currMove.to.y,
          },
        });

        break;
      }
    }
    //LEFT

    for (let delta = 1; delta <= pos.x; delta++) {
      const currMove: Move = {
        from: pos,
        to: {
          x: pos.x - delta,
          y: pos.y,
        },
        piece,
        type: "normal",
      };

      const cellContent = board[currMove.to.x][currMove.to.y];
      if (!cellContent) {
        moves.push(currMove);
        continue;
      }

      if (cellContent.color === piece.color) {
        break;
      }

      if (cellContent.color !== piece.color) {
        moves.push({
          ...currMove,
          capture: {
            piece: cellContent,
            x: currMove.to.x,
            y: currMove.to.y,
          },
        });

        break;
      }
    }

    //BOTTOM
    for (let delta = 1; delta < config.tileCount - pos.y; delta++) {
      const currMove: Move = {
        from: pos,
        to: {
          x: pos.x,
          y: pos.y + delta,
        },
        piece,
        type: "normal",
      };

      const cellContent = board[currMove.to.x][currMove.to.y];
      if (!cellContent) {
        moves.push(currMove);
        continue;
      }

      if (cellContent.color === piece.color) {
        break;
      }

      if (cellContent.color !== piece.color) {
        moves.push({
          ...currMove,
          capture: {
            piece: cellContent,
            x: currMove.to.x,
            y: currMove.to.y,
          },
        });

        break;
      }
    }

    //RIGHT
    for (let delta = 1; delta < config.tileCount - pos.x; delta++) {
      const currMove: Move = {
        from: pos,
        to: {
          x: pos.x + delta,
          y: pos.y,
        },
        piece,
        type: "normal",
      };

      const cellContent = board[currMove.to.x][currMove.to.y];
      if (!cellContent) {
        moves.push(currMove);
        continue;
      }

      if (cellContent.color === piece.color) {
        break;
      }

      if (cellContent.color !== piece.color) {
        moves.push({
          ...currMove,
          capture: {
            piece: cellContent,
            x: currMove.to.x,
            y: currMove.to.y,
          },
        });

        break;
      }
    }

    return moves;
  }
}

export const rookMoveChecker = new RookMoveChecker();
