import config from "@/game/models/config.json";
import { Castle, Color, isCastle, Move, Piece, PieceType } from "@/types/types";

export type Board = Array<Array<Piece | undefined>>;
export type Game = {
  moves: Move[];
  board: Board;
};
export const defaultGame = (): Game => {
  const grid: Array<Array<Piece | undefined>> = [];
  for (let i = 0; i < config.tileCount; i++) {
    grid.push(new Array(config.tileCount).fill(undefined));
  }

  const pieceOrder: PieceType[] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  pieceOrder.forEach((val, x) => {
    grid[x][0] = {
      type: val,
      color: "black",
      hasMoved: false,
    };
    grid[x][config.tileCount - 1] = {
      type: val,
      color: "white",
      hasMoved: false,
    };
  }, []);

  for (let x = 0; x < config.tileCount; x++) {
    grid[x][1] = {
      type: "pawn",
      color: "black",
      hasMoved: false,
    };
    grid[x][config.tileCount - 2] = {
      type: "pawn",
      color: "white",
      hasMoved: false,
    };
  }

  return {
    board: grid,
    moves: [],
  };
};

export const goToPreviousMove = (game: Game) => {
  const move = game.moves.pop();
  if (!move) return;

  undoMove(game, move);
  if (!isCastle(move)) {
    move.piece.hasMoved = false;
  }

  return move;
};

export const findCoordsForPiece = (
  board: Board,
  pieceType: PieceType,
  pieceColor: Color,
) => {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      const pos = { x, y };
      const piece = board[x][y];
      if (piece && piece.type === pieceType && piece.color === pieceColor) {
        return pos;
      }
    }
  }
  return undefined;
};

export const getTrait = (game: Game) => {
  return game.moves.length % 2 === 0 ? "white" : "black";
};

export const applyMove = (game: Game, move: Move) => {
  if (isCastle(move)) {
    applyCastle(game, move);
  } else if (move.capture) {
    game.board[move.capture.x][move.capture.y] = undefined;
  }

  if (move.type === "normal") {
    game.board[move.from.x][move.from.y] = undefined;
    game.board[move.to.x][move.to.y] = move.piece;
  }

  game.moves.push(move);
};
export const applyCastle = (game: Game, move: Castle) => {
  if (move.type === "long") {
    applyLongCastle(game, move);
  } else {
    applyShortCastle(game, move);
  }
};

export const applyLongCastle = (game: Game, move: Castle) => {
  const kingPos = move.color === "white" ? { x: 4, y: 7 } : { x: 4, y: 0 };

  const rookPos = move.color === "white" ? { x: 0, y: 7 } : { x: 0, y: 0 };

  const king = game.board[kingPos.x][kingPos.y];
  const rook = game.board[rookPos.x][rookPos.y];

  game.board[4][kingPos.y] = undefined;
  game.board[3][kingPos.y] = rook;
  game.board[2][kingPos.y] = king;
  game.board[0][kingPos.y] = undefined;
};

export const applyShortCastle = (game: Game, move: Castle) => {
  const kingPos = move.color === "white" ? { x: 4, y: 7 } : { x: 4, y: 0 };

  const rookPos = move.color === "white" ? { x: 7, y: 7 } : { x: 7, y: 0 };

  const king = game.board[kingPos.x][kingPos.y];
  const rook = game.board[rookPos.x][rookPos.y];

  game.board[kingPos.x][kingPos.y] = undefined;
  game.board[5][kingPos.y] = rook;
  game.board[6][kingPos.y] = king;
  game.board[7][kingPos.y] = undefined;
};

export const undoCastle = (game: Game, move: Castle) => {
  const kingPos = move.color === "white" ? { x: 4, y: 7 } : { x: 4, y: 0 };
  if (move.type === "long") {
    const king = game.board[2][kingPos.y];
    const rook = game.board[3][kingPos.y];

    if (!king || !rook) return;

    rook.hasMoved = false;
    king.hasMoved = false;

    game.board[0][kingPos.y] = rook;
    game.board[2][kingPos.y] = undefined;
    game.board[3][kingPos.y] = undefined;
    game.board[4][kingPos.y] = king;
  }

  if (move.type === "short") {
    const king = game.board[6][kingPos.y];
    const rook = game.board[5][kingPos.y];

    if (!king || !rook) return;

    rook.hasMoved = false;
    king.hasMoved = false;

    game.board[7][kingPos.y] = rook;
    game.board[6][kingPos.y] = undefined;
    game.board[5][kingPos.y] = undefined;
    game.board[4][kingPos.y] = king;
  }
};

export const undoMove = (game: Game, move: Move) => {
  if (isCastle(move)) {
    undoCastle(game, move);
    return;
  }

  game.board[move.from.x][move.from.y] = move.piece;
  game.board[move.to.x][move.to.y] = undefined;

  if (move.capture) {
    game.board[move.capture.x][move.capture.y] = move.capture.piece;
  }
};
