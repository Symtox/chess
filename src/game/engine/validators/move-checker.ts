import config from "@/game/models/config.json";
import {Capture, Coordinate, Move} from "@/types/types";
import { Piece } from "@/types/types";
import {Board, Game} from "@/types/game";

export interface MoveValidator {
  getPossibleMoves(
    piece: Piece,
    pos: Coordinate,
    game: Game
  ): Move[];
}

export class MoveValidatorHelpers {
  static isSquareFree(pos: Coordinate, board: Board) {
    return !board[pos.x][pos.y]
  }

  static isValidBoardCoordinate({x, y}: Coordinate) {
    return x >= 0 && x < config.tileCount && y >= 0 && y < config.tileCount;
  }
}

export class MoveChecker {
  // isValidBoardCoordinate(x: number, y: number) {
  //   return x >= 0 && x < config.tileCount && y >= 0 && y < config.tileCount;
  // }
  //
  // isCapture(pos: Coordinate, piece: Piece, grid: Grid) {
  //   const cell = grid.getPiece(pos);
  //   return !!cell && cell.color !== piece.color;
  // }
  //
  // isSquareAllyFree(pos: Coordinate, color: Color, grid: Grid) {
  //   const cell = grid.getPiece(pos);
  //   return !cell || cell.color !== color;
  // }
}
