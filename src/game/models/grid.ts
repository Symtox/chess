import config from '@/game/models/config.json'

import {Coordinate} from "@/types";
import {Castle, Color, isCastle, Move, Piece, PieceType} from "@/types";

export class Grid {
  public grid: (Piece | undefined)[][]

  constructor(grid?: (Piece | undefined)[][]) {
    if(!grid) {
      this.grid = this.getInitialGrid()
    } else {
      this.grid = grid
    }
  }


  getInitialGrid() {
    const grid: Array<Array<Piece | undefined>> = []
    for(let i = 0; i < config.tileCount; i++) {
      grid.push((new Array(config.tileCount)).fill(undefined))
    }

    const pieceOrder: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
    pieceOrder.forEach((val, x) => {
      grid[x][0] = {
        type: val,
        color: "black",
        hasMoved: false
      }
      grid[x][config.tileCount - 1] = {
        type: val,
        color: "white",
        hasMoved: false
      }
    }, [])

    for(let x = 0; x < config.tileCount; x++) {
      grid[x][1] = {
        type: "pawn",
        color: "black",
        hasMoved: false
      }
      grid[x][config.tileCount - 2] = {
        type: "pawn",
        color: "white",
        hasMoved: false
      }
    }

    return grid;
  }

  applyMove(move: Move) {
    if(isCastle(move)) {
      this.applyCastle(move)
      return
    }

    if(move.capture) {
      this.grid[move.capture.x][move.capture.y] = undefined
    }

    this.grid[move.from.x][move.from.y] = undefined
    this.grid[move.to.x][move.to.y] = move.piece

  }

  undoMove(move: Move) {

    if(isCastle(move)) {
      this.undoCastle(move)
      return
    }

    this.grid[move.from.x][move.from.y] = move.piece
    this.grid[move.to.x][move.to.y] = undefined

    if(move.capture) {
      this.grid[move.capture.x][move.capture.y] = move.capture.piece
    }
  }

  getPiece(pos: Coordinate) {
    return this.grid[pos.x][pos.y]
  }

  clone() {
    const grid = this.grid.map(col => {
      return col.map(square => {
        if (square) {
          return {
            ...square
          }
        }
        return square
      })
    })
    return new Grid(grid)
  }

  findCoordsForPiece(pieceType: PieceType, pieceColor: Color) {
    for(let x = 0; x < this.grid.length; x++) {
      for(let y = 0; y < this.grid[x].length; y++) {
        const pos = { x, y }
        const piece = this.getPiece(pos)
        if(piece && piece.type === pieceType && piece.color === pieceColor) {
          return pos
        }
      }
    }
    return undefined
  }

  applyCastle(move: Castle) {
    if(move.type === "long") {
      this.applyLongCastle(move)
    } else {
      this.applyShortCastle(move)
    }
  }

  applyLongCastle(move: Castle) {
    const kingPos = move.color === "white"
      ? {x: 4, y: 7}
      : {x: 4, y: 0}

    const rookPos = move.color === "white"
      ? {x: 0, y: 7}
      : {x: 0, y: 0}

    const king = this.grid[kingPos.x][kingPos.y]
    const rook = this.grid[rookPos.x][rookPos.y]

    this.grid[4][kingPos.y] = undefined
    this.grid[3][kingPos.y] = rook
    this.grid[2][kingPos.y] = king
    this.grid[0][kingPos.y] = undefined
  }

  applyShortCastle(move: Castle) {
    const kingPos = move.color === "white"
      ? { x: 4, y: 7 }
      : { x: 4, y: 0 }

    const rookPos = move.color === "white"
      ? { x: 7, y: 7 }
      : { x: 7, y: 0 }

    const king = this.grid[kingPos.x][kingPos.y]
    const rook = this.grid[rookPos.x][rookPos.y]

    this.grid[kingPos.x][kingPos.y] = undefined
    this.grid[5][kingPos.y] = rook
    this.grid[6][kingPos.y] = king
    this.grid[7][kingPos.y] = undefined

  }

  undoCastle(move: Castle) {
    const kingPos = move.color === "white"
      ? { x: 4, y: 7 }
      : { x: 4, y: 0 }
    if(move.type === "long") {
      const king = this.grid[2][kingPos.y]
      const rook = this.grid[3][kingPos.y]

      if(!king || !rook) return

      rook.hasMoved = false;
      king.hasMoved = false;


      this.grid[0][kingPos.y] = rook
      this.grid[2][kingPos.y] = undefined
      this.grid[3][kingPos.y] = undefined
      this.grid[4][kingPos.y] = king
    }

    if(move.type === "short") {
      const king = this.grid[6][kingPos.y]
      const rook = this.grid[5][kingPos.y]

      if(!king || !rook) return

      rook.hasMoved = false;
      king.hasMoved = false;

      this.grid[7][kingPos.y] = rook
      this.grid[6][kingPos.y] = undefined
      this.grid[5][kingPos.y] = undefined
      this.grid[4][kingPos.y] = king
    }
  }

}

