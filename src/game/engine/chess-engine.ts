import { moveCheckFactory } from "./move-checkers/move-checker-factory";
import {
  Color,
  Coordinate,
  getOpponentColor,
  isCastle,
  isNormalMove,
  Move,
  Piece,
} from "@/types";
import { Grid } from "@/game/models/grid";

export class ChessEngine {
  constructor() {}

  computeAllowedMoves(
    piece: Piece,
    grid: Grid,
    pos: Coordinate,
    lastMove?: Move,
  ) {
    const moves = moveCheckFactory
      .getInstance(piece.type)
      .getPossibleMoves(piece, pos, grid, lastMove);

    const [legal] = this.separateCheckedMovesFromLegal(
      moves,
      grid,
      piece.color,
    );
    return legal;
  }

  getControlledSquareForColor(grid: Grid, color: Color) {
    return grid.grid.reduce((gAcc, col, x) => {
      const cSquares = col.reduce((cAcc, square, y) => {
        if (!square || square.color !== color) return cAcc;

        const pos = { x: x, y: y };
        const squares = moveCheckFactory
          .getInstance(square.type)
          .getPossibleMoves(square, pos, grid)
          .filter((move) => isNormalMove(move))
          .map((move) => move.to);

        return [...cAcc, ...squares];
      }, [] as Coordinate[]);
      return [...gAcc, ...cSquares];
    }, [] as Coordinate[]);
  }

  separateCheckedMovesFromLegal(moves: Move[], grid: Grid, color: Color) {
    const legals: Move[] = [];
    const checked: Move[] = [];

    moves.forEach((move) => {
      const tempGrid = grid.clone();

      if (isCastle(move) && this.isCheckForColor(tempGrid, color)) {
        checked.push(move);
        return;
      }

      tempGrid.applyMove(move);
      if (this.isCheckForColor(tempGrid, color)) {
        checked.push(move);
      } else {
        legals.push(move);
      }
    });

    return [legals, checked];
  }

  isCheckForColor(grid: Grid, color: Color) {
    const kingCoords = grid.findCoordsForPiece("king", color);
    if (!kingCoords) throw new Error("king not found ??");
    const opponentControlledSquare = this.getControlledSquareForColor(
      grid,
      getOpponentColor(color),
    );

    return opponentControlledSquare.some(
      (square) => square.x === kingCoords.x && square.y === kingCoords.y,
    );
  }

  isCheckMate(grid: Grid, color: Color, lastMove?: Move) {
    const moves = this.computeAllAllowedMoves(grid, color, lastMove);

    return moves.length === 0 && this.isCheckForColor(grid, color);
  }

  isStaleMate(grid: Grid, color: Color, lastMove?: Move) {
    const moves = this.computeAllAllowedMoves(grid, color, lastMove);

    return moves.length === 0 && !this.isCheckForColor(grid, color);
  }

  computeAllAllowedMoves(grid: Grid, color: Color, lastMove?: Move) {
    const moves = [];
    for (let x = 0; x < grid.grid.length; x++) {
      for (let y = 0; y < grid.grid[x].length; y++) {
        const pos = { x: x, y: y };
        const piece = grid.getPiece(pos);
        if (piece && piece.color === color) {
          moves.push(...this.computeAllowedMoves(piece, grid, pos, lastMove));
        }
      }
    }

    return moves;
  }
}
