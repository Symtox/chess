import config from "@/game/models/config.json";
import {  Coordinate, Move } from "@/types/types";
import { Piece } from "@/types/types";
import { Board, Game } from "@/types/game";

export interface MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, game: Game): Move[];
}

export class MoveValidatorHelpers {
  static isSquareFree(pos: Coordinate, board: Board) {
    return !board[pos.x][pos.y];
  }

  static isValidBoardCoordinate({ x, y }: Coordinate) {
    return x >= 0 && x < config.tileCount && y >= 0 && y < config.tileCount;
  }
}
