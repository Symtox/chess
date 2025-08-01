import {MoveChecker, MoveValidator, MoveValidatorHelpers} from "./move-checker";
import {Coordinate, Move, NormalMove} from "@/types/types";
import { Piece } from "@/types/types";
import {Board, Game} from "@/types/game";

export class BishopMoveChecker extends MoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, { board }: Game) {
    const moveCoordinateBuilder: Array<(distance: number) => Coordinate> = [
      (distance: number) => ({ x: pos.x - distance, y: pos.y - distance }),
      (distance: number) => ({ x: pos.x + distance, y: pos.y - distance }),
      (distance: number) => ({ x: pos.x - distance, y: pos.y + distance }),
      (distance: number) => ({ x: pos.x + distance, y: pos.y + distance })
    ]


    return moveCoordinateBuilder.map(coordBuilder => {
      const moves: Move[] = []

      for (
        let distance = 1;
        MoveValidatorHelpers.isValidBoardCoordinate(coordBuilder(distance));
        distance++
      ) {
        const newPos = coordBuilder(distance);
        const move: Move = {
          from: pos,
          to: newPos,
          piece,
          type: "normal",
        };

        const cellContent = board[newPos.x][newPos.y]
        if(!cellContent) {
          moves.push(move)
          continue
        }

        if(cellContent.color === piece.color) {
          break;
        }

        moves.push({
          ...move,
          capture: {
            x: newPos.x,
            y: newPos.y,
            piece: cellContent,
          }
        })
        break;
      }
      return moves;
    }).flat()
  }
}

export const bishopMoveChecker = new BishopMoveChecker();
