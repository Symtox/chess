import config from '/src/game/models/config.json'
import {Piece} from "./piece.js";
import {Coordinate} from "../../utils/coordinate.js";
import {Castle} from "../engine/moves/castle.js";

export class Grid {
  constructor(grid) {
    if(!grid) {
      this.grid = this.getInitialGrid()
    } else {
      this.grid = grid
    }
  }


  getInitialGrid() {
    const grid = []
    for(let i = 0; i < config.tileCount; i++) {
      grid.push((new Array(config.tileCount)).fill(undefined))
    }

    const pieceOrder = ["ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK"]
    pieceOrder.forEach((val, x) => {
      grid[x][0] = new Piece(val, "black")
      grid[x][config.tileCount - 1] = new Piece(val, "white")
    }, [])

    for(let x = 0; x < config.tileCount; x++) {
      grid[x][1] = new Piece("PAWN", "black")
      grid[x][config.tileCount - 2] = new Piece("PAWN", "white")
    }

    return grid;
  }

  applyMove(move) {
    if(move instanceof Castle) {
      this.applyCastle(move)
      return
    }

    if(move.capture) {
      this.grid[move.capture.x][move.capture.y] = undefined
    }

    this.grid[move.from.x][move.from.y] = undefined
    this.grid[move.to.x][move.to.y] = move.piece

  }

  undoMove(move) {

    if(move instanceof Castle) {
      this.undoCastle(move)
      return
    }


    this.grid[move.from.x][move.from.y] = move.piece
    this.grid[move.to.x][move.to.y] = undefined

    if(move.capture) {
      this.grid[move.capture.x][move.capture.y] = move.capture.piece
    }

  }

  getPiece(pos) {
    return this.grid[pos.x][pos.y]
  }

  clone() {
    const grid = this.grid.map(col => {
      return col.map(square => {
        if (square) {
          return square.clone()
        }
        return square
      })
    })
    return new Grid(grid)
  }

  findCoordsForPiece(pieceType, pieceColor) {
    for(let x = 0; x < this.grid.length; x++) {
      for(let y = 0; y < this.grid[x].length; y++) {
        const pos = new Coordinate(x, y)
        const piece = this.getPiece(pos)
        if(piece && piece.type === pieceType && piece.color === pieceColor) {
          return pos
        }
      }
    }
  }

  applyCastle(move) {
    if(move.type === "long") {
      this.applyLongCastle(move)
    } else {
      this.applyShortCastle(move)
    }
  }

  applyLongCastle(move) {
    const kingPos = move.color === "white"
      ? new Coordinate(4, 7)
      : new Coordinate(4, 0)

    const rookPos = move.color === "white"
      ? new Coordinate(0, 7)
      : new Coordinate(0, 0)

    const king = this.grid[kingPos.x][kingPos.y]
    const rook = this.grid[rookPos.x][rookPos.y]

    this.grid[4][kingPos.y] = undefined
    this.grid[3][kingPos.y] = rook
    this.grid[2][kingPos.y] = king
    this.grid[0][kingPos.y] = undefined
  }

  applyShortCastle(move) {
    const kingPos = move.color === "white"
      ? new Coordinate(4, 7)
      : new Coordinate(4, 0)

    const rookPos = move.color === "white"
      ? new Coordinate(7, 7)
      : new Coordinate(7, 0)

    const king = this.grid[kingPos.x][kingPos.y]
    const rook = this.grid[rookPos.x][rookPos.y]

    this.grid[kingPos.x][kingPos.y] = undefined
    this.grid[5][kingPos.y] = rook
    this.grid[6][kingPos.y] = king
    this.grid[7][kingPos.y] = undefined

  }

  undoCastle(move) {
    const kingPos = move.color === "white"
      ? new Coordinate(4, 7)
      : new Coordinate(4, 0)

    if(move.type === "long") {
      const king = this.grid[2][kingPos.y]
      const rook = this.grid[3][kingPos.y]

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

      rook.hasMoved = false;
      king.hasMoved = false;

      this.grid[7][kingPos.y] = rook
      this.grid[6][kingPos.y] = undefined
      this.grid[5][kingPos.y] = undefined
      this.grid[4][kingPos.y] = king
    }
  }

}

