import config from "/src/game/models/config"
import {moveCheckFactory} from "./move-checkers/move-checker-factory.js";
import {Coordinate} from "../../utils/coordinate.js";
import {getOpponentColor} from "../../utils/utils.js";
import {Castle} from "./moves/castle.js";

export class ChessEngine {
  constructor() {}

  computeAllowedMoves(piece, grid, pos, lastMove) {
    const moves = moveCheckFactory.getInstance(piece.type)
      .getPossibleMoves(piece, pos, grid, lastMove)

    const [ legal, checked ] = this.separateCheckedMovesFromLegal(moves, grid, piece.color)
    return legal
  }

  getControlledSquareForColor(grid, color) {
    return grid.grid.reduce((gAcc, col, x) => {
      const cSquares = col.reduce((cAcc, square, y) => {
        if(!square || square.color !== color) return cAcc

        const pos = new Coordinate(x, y)
        const squares = moveCheckFactory.getInstance(square.type)
          .getPossibleMoves(square, pos, grid)
          .filter(move => !(move instanceof Castle))
          .reduce((acc, move) => [...acc, move.to], [])

        return [...cAcc, ...squares]
      }, [])
      return [...gAcc, ...cSquares]
    }, [])
  }


  separateCheckedMovesFromLegal(moves, grid, color) {
    const legals = []
    const checked = []




    moves.forEach((move) => {

      const tempGrid = grid.clone()

      if(move instanceof Castle && this.isCheckForColor(tempGrid, color)) {
        checked.push(move)
        return
      }

      tempGrid.applyMove(move)
      if(this.isCheckForColor(tempGrid, color)) {
        checked.push(move)
      } else {
        legals.push(move)
      }
    })

    return [ legals, checked ]
  }

  isCheckForColor(grid, color) {
    const kingCoords = grid.findCoordsForPiece("KING", color)
    const opponentControlledSquare = this.getControlledSquareForColor(grid, getOpponentColor(color))

    return opponentControlledSquare.some(square => square.x === kingCoords.x && square.y === kingCoords.y)
  }

  isCheckMate(grid, color, lastMove) {
    const moves = this.computeAllAllowedMoves(grid, color, lastMove);


    return moves.length === 0 && this.isCheckForColor(grid, color)
  }

  isStaleMate(grid, color, lastMove) {
    const moves = this.computeAllAllowedMoves(grid, color, lastMove);

    return moves.length === 0 && !this.isCheckForColor(grid, color)
  }

  computeAllAllowedMoves(grid, color, lastMove) {
    const moves = []
    for(let x = 0; x < grid.grid.length; x++) {
      for(let y = 0; y < grid.grid[x].length; y++) {
        const pos = new Coordinate(x, y)
        const piece = grid.getPiece(pos)
        if(piece && piece.color === color) {
          moves.push(...this.computeAllowedMoves(piece, grid, pos, lastMove))
        }
      }
    }

    return moves
  }
}