import {MoveChecker, MoveValidator, MoveValidatorHelpers} from "./move-checker";
import { Coordinate, Piece } from "@/types/types";
import { Move } from "@/types/types";
import {Board, Game} from "@/types/game";

export class KingMoveChecker extends MoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, game: Game) {
    const moves: Move[] = []

    moves.push(...this.getBasicMoves(piece, pos, game.board))

    const shortCastleMove = this.getShortCastleMove(piece, pos, game.board)
    if(shortCastleMove) {
      moves.push(shortCastleMove)
    }

    const longCastleMove = this.getLongCastleMove(piece, pos, game.board)
    if(longCastleMove) {
      moves.push(longCastleMove)
    }

    return moves
  }

  getBasicMoves(piece: Piece, pos: Coordinate, board: Board) {
    const moves: Move[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const movePos = {x: pos.x + dx, y: pos.y + dy};
        const move = this.getPossibleMove(piece, pos, movePos, board)
        if(move) {
          moves.push(move)
        }
      }
    }

    return moves;
  }

  getPossibleMove(piece: Piece, pos: Coordinate, candidatePos: Coordinate, board: Board) {
    if (!MoveValidatorHelpers.isValidBoardCoordinate(candidatePos)) {
      return
    }

    const move: Move = {
      from: pos,
      to: candidatePos,
      piece,
      type: "normal",
    };

    const cellContent = board[candidatePos.x][candidatePos.y]
    if(!cellContent) {
      return move
    }

    if(cellContent.color === piece.color) {
      return
    }

    return {
      ...move,
      capture: {
        x: candidatePos.x,
        y: candidatePos.y,
        piece: cellContent,
      }
    }
  }

  getShortCastleMove(piece: Piece, pos: Coordinate, board: Board): Move | undefined {

    const pieceInKingSlot = board[4][pos.y]
    const pieceInLeftRookSlot = board[0][pos.y];

    if (
      !board[1][pos.y]
      && !board[2][pos.y]
      && !board[3][pos.y]
      && pieceInLeftRookSlot
      && pieceInLeftRookSlot.type === "rook"
      && !pieceInLeftRookSlot.hasMoved
      && pieceInKingSlot
      && pieceInKingSlot.type === "king"
      && !pieceInKingSlot.hasMoved
    ) {
      return {
        type: "long",
        color: piece.color,
      };
    }
  }

  getLongCastleMove(piece: Piece, pos: Coordinate, board: Board): Move | undefined {
    const pieceInKingSlot = board[4][pos.y]
    const pieceInRightRookSlot = board[7][pos.y];

    if (
      !board[5][pos.y]
      && !board[6][pos.y]
      && pieceInRightRookSlot
      && pieceInRightRookSlot.type === "rook"
      && !pieceInRightRookSlot.hasMoved
      && pieceInKingSlot
      && pieceInKingSlot.type === "king"
      && !pieceInKingSlot.hasMoved
    ) {
      return {
        type: "short",
        color: piece.color,
      }
    }
  }
}

export const kingMoveChecker = new KingMoveChecker();
