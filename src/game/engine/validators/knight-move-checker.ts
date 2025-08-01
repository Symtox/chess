import {MoveChecker, MoveValidator, MoveValidatorHelpers} from "./move-checker";
import { Move } from "@/types/types";
import { Coordinate, Piece } from "@/types/types";
import {Board, Game} from "@/types/game";

export class KnightMoveChecker extends MoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, { board }: Game) {
    const moves: Array<Move | undefined> = [];
    const moveLength = 2,
      moveWidth = 1;

    for (let xDirection = -1; xDirection <= 1; xDirection += 2) {
      for (let yDirection = -1; yDirection <= 1; yDirection += 2) {
        const movePos = {
          x: pos.x + moveWidth * xDirection,
          y: pos.y + moveLength * yDirection,
        };
        const invertedMovePos = {
          x: pos.x + moveLength * xDirection,
          y: pos.y + moveWidth * yDirection,
        };

        moves.push(this.computeKnightMove(piece, pos, movePos, board));
        moves.push(this.computeKnightMove(piece, pos, invertedMovePos, board));
      }
    }
    return moves.filter((move) => move !== undefined);
  }

  computeKnightMove(
    piece: Piece,
    oldPos: Coordinate,
    newPos: Coordinate,
    board: Board,
  ): Move | undefined {
    if (!MoveValidatorHelpers.isValidBoardCoordinate(newPos)) {
      return
    }

    const move: Move = {
      from: oldPos,
      to: newPos,
      piece: piece,
      type: "normal",
    }

    const cellContent = board[newPos.x][newPos.y]
    if(!cellContent) return move
    if(cellContent.color === piece.color) return

    return {
     ...move,
     capture: {
       piece: cellContent,
       x: newPos.x,
       y: newPos.y,
     }
    };
  }
}

export const knightMoveChecker = new KnightMoveChecker();
