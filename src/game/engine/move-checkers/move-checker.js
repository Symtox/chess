import config from "../../models/config.json";
import {Coordinate} from "../../../utils/coordinate.js";

export class MoveChecker {
  isValidBoardCoordinate(x, y) {
    return x >= 0 && x < config.tileCount && y >= 0 && y < config.tileCount
  }

  isCapture(pos, piece, grid) {
    const cell = grid.getPiece(pos)
    return !!cell && cell.color !== piece.color
  }

  isSquareFree(x, y, grid) {
    return !grid.getPiece(new Coordinate(x, y));
  }


  isSquareAllyFree(pos, color, grid) {
    const cell = grid.getPiece(pos)
    return !cell || cell.color !== color
  }
}