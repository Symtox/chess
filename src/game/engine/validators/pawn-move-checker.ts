import {MoveChecker, MoveValidator, MoveValidatorHelpers} from "./move-checker";
import {Coordinate, isCastle, Move} from "@/types/types";
import { Piece } from "@/types/types";
import {Board, Game} from "@/types/game";

export class PawnMoveChecker extends MoveChecker implements MoveValidator {
  getPossibleMoves(piece: Piece, pos: Coordinate, game: Game) {
    const moves: Move[] = []

    const oneStepForwardMove = this.getOneCellForwardMove(piece, pos, game.board)
    if(oneStepForwardMove) {
      moves.push(oneStepForwardMove)
    }

    const enPassant = this.getEnPassantMove(piece, pos, game.board, game.moves[game.moves.length - 1])
    if(enPassant) {
      moves.push(enPassant)
    }

    const twoStepForwardMove = this.getTwoCellForwardMove(piece, pos, game.board)
    if(twoStepForwardMove) {
      moves.push(twoStepForwardMove)
    }

    moves.push(...this.getCaptureMoves(piece, pos, game.board))

    return moves;
  }

  getOneCellForwardMove(piece: Piece, pos: Coordinate, board: Board): Move | undefined {
    const yIncrement = piece.color === "black" ? 1 : -1;

    const oneCellForwardPos = {x: pos.x, y: pos.y + yIncrement}
    if (
      !MoveValidatorHelpers.isValidBoardCoordinate(oneCellForwardPos)
      || board[oneCellForwardPos.x][oneCellForwardPos.y]
    ) {
      return
    }

    return {
      from: pos,
      to: oneCellForwardPos,
      piece: piece,
      type: "normal",
    };
  }

  getTwoCellForwardMove(piece: Piece, pos: Coordinate, board: Board): Move | undefined {
    const yIncrement = piece.color === "black" ? 1 : -1;
    const yStart = piece.color === 'black' ? 1 : 6

    if (
      piece.hasMoved
      || !MoveValidatorHelpers.isSquareFree({ x: pos.x, y: yStart +yIncrement}, board)
      || !MoveValidatorHelpers.isSquareFree({ x: pos.x, y: yStart +yIncrement * 2}, board)
    ) {
      return
    }

    const newPos = { x: pos.x, y: yStart + yIncrement * 2 };
    return {
      from: pos,
      to: newPos,
      piece: piece,
      type: "normal",
    }
  }

  getCaptureMoves(piece: Piece, pos: Coordinate, board: Board): Move[] {
    const yIncrement = piece.color === "black" ? 1 : -1;
    const moves: Move[] = [];

    for (let dir = -1; dir <= 1; dir += 2) {
      const captureCoords = { x: pos.x + dir, y: pos.y + yIncrement };
      if (!MoveValidatorHelpers.isValidBoardCoordinate(captureCoords)) {
        continue
      }

      const capture = board[captureCoords.x][captureCoords.y]
      if(capture && capture.color !== piece.color)
        moves.push({
          from: pos,
          to: captureCoords,
          piece: piece,
          type: "normal",
          capture: {
            piece: capture,
            x: captureCoords.x,
            y: captureCoords.y,
          },
        });
    }

    return moves;
  }

  getEnPassantMove(
    piece: Piece,
    { x, y }: Coordinate,
    board: Board,
    lastMove?: Move,
  ): Move | undefined {
    const yIncrement = piece.color === "black" ? 1 : -1;
    if (
      !lastMove ||
      isCastle(lastMove) ||
      lastMove.piece.type !== "pawn" ||
      Math.abs(lastMove.from.y - lastMove.to.y) !== 2 ||
      Math.abs(lastMove.to.x - x) !== 1 ||
      lastMove.to.y !== y
    ) {
      return;
    }

    return {
      from: { x: x, y: y },
      to: { x: lastMove.to.x, y: y + yIncrement },
      piece: piece,
      type: "normal",
      capture: {
        piece: lastMove.piece,
        x: lastMove.to.x,
        y: lastMove.to.y,
      },
    }
  }
}

export const pawnMoveChecker = new PawnMoveChecker();
