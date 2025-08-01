import { moveCheckFactory } from "@/game/engine/validators/move-checker-factory";
import {
  clonePojo,
  Color,
  Coordinate,
  getOpponentColor,
  isCastle,
  isNormalMove,
  Move,
  Piece,
} from "@/types/types";
import {applyMove, findCoordsForPiece, Game} from "@/types/game";

export class ChessEngine {
  constructor() {}



  getControlledSquareForColor(game: Game, color: Color) {
    return game.board.reduce((gAcc, col, x) => {
      const cSquares = col.reduce((cAcc, square, y) => {
        if (!square || square.color !== color) return cAcc;

        const pos = { x: x, y: y };
        const squares = moveCheckFactory
          .getInstance(square.type)
          .getPossibleMoves(square, pos, game)
          .filter((move) => isNormalMove(move))
          .map((move) => move.to);

        return [...cAcc, ...squares];
      }, [] as Coordinate[]);
      return [...gAcc, ...cSquares];
    }, [] as Coordinate[]);
  }

  separateCheckedMovesFromLegal(moves: Move[], game: Game, color: Color) {
    const legals: Move[] = [];
    const checked: Move[] = [];

    moves.forEach((move) => {
      const tempGame = clonePojo(game);

      if (isCastle(move) && this.isCheckForColor(tempGame, color)) { //todo
        checked.push(move);
        return;
      }

      applyMove(tempGame, move);
      if (this.isCheckForColor(tempGame, color)) {
        checked.push(move);
      } else {
        legals.push(move);
      }
    });

    return [legals, checked];
  }

  isCheckForColor(game: Game, color: Color) {
    const kingCoords = findCoordsForPiece(game.board, "king", color);
    if (!kingCoords) throw new Error("king not found ??"); //TODO
    const opponentControlledSquare = this.getControlledSquareForColor(
      game,
      getOpponentColor(color),
    );

    return opponentControlledSquare.some(
      (square) => square.x === kingCoords.x && square.y === kingCoords.y,
    );
  }

  isCheckMate(game: Game, color: Color) {
    const moves = this.computeAllAllowedMoves(game, color);

    return moves.length === 0 && this.isCheckForColor(game, color);
  }

  isStaleMate(game: Game, color: Color) {
    const moves = this.computeAllAllowedMoves(game, color);

    return moves.length === 0 && !this.isCheckForColor(game, color);
  }

  computeAllAllowedMoves(game: Game, color: Color) {
    const moves = [];
    for (let x = 0; x < game.board.length; x++) {
      for (let y = 0; y < game.board[x].length; y++) {
        const piece = game.board[x][y];
        if (piece && piece.color === color) {
          moves.push(...this.computeAllowedMoves(piece, { x: x, y: y }, game));
        }
      }
    }

    return moves;
  }

  computeAllowedMoves(
    piece: Piece,
    pos: Coordinate,
    game: Game
  ) {
    const moves = moveCheckFactory
      .getInstance(piece.type)
      .getPossibleMoves(piece, pos, game);

    const [legal, illegal] = this.separateCheckedMovesFromLegal(
      moves,
      game,
      piece.color,
    );
    console.log("lgeal", legal, "ill", illegal )

    return legal;
  }
}
