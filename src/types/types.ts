export type Color = "black" | "white";

export type OppositeColor<T extends Color> = T extends "white"
  ? "black"
  : "white";

export type PieceType =
  | "pawn"
  | "knight"
  | "bishop"
  | "rook"
  | "queen"
  | "king";

export type MoveType = "normal" | "long" | "short";

export type Coordinate = {
  x: number;
  y: number;
};

export type Piece = {
  type: PieceType;
  color: Color;
  hasMoved: boolean;
};

type BaseMove = {
  type: MoveType;
};

export type NormalMove = BaseMove & {
  type: "normal";
  from: Coordinate;
  to: Coordinate;
  piece: Piece;
  capture?: Capture;
};

export type Castle = BaseMove & {
  type: "long" | "short";
  color: Color;
};

export const isCastle = (move: Move): move is Castle => {
  return move.type === "long" || move.type === "short";
};

export const isNormalMove = (move: Move): move is NormalMove => {
  return move.type === "normal";
};

export type Move = Castle | NormalMove;

export type Capture = {
  piece: Piece;
  x: number;
  y: number;
};

export const getOpponentColor = (color: Color): OppositeColor<typeof color> => {
  return color === "black" ? "white" : "black";
};

export const getMoveIndicationCoordinates = (move: Move) => {
  if (isCastle(move)) {
    const kingY = move.color === "black" ? 0 : 7;
    if (move.type === "long") {
      return { x: 2, y: kingY };
    }
    return { x: 6, y: kingY };
  }
  return move.to;
};

export const clonePojo = <T>(obj: T) => {
  return JSON.parse(JSON.stringify(obj)) as T
}