import {spriteHandler} from "./sprites/sprite-handler.js";

export class PieceRender {

  pieceTileScaleFactor = .75

  constructor(canvas, tileSize) {
    this.canvas = canvas
    this.tileSize = tileSize
  }



  renderPieceByCanvasLocation(piece, x, y) {
    const positionInSprite = spriteHandler.getPieceCoordinate(piece.type, piece.color);
    this.canvas.getContext("2d").drawImage(
      spriteHandler.getSprite(),
      positionInSprite.x,
      positionInSprite.y,
      positionInSprite.width,
      positionInSprite.height,
      x,
      y,
      this.tileSize * this.pieceTileScaleFactor,
      this.tileSize * this.pieceTileScaleFactor
    )
  }

  renderPieceByGridPosition(piece, x, y) {
    this.renderPieceByCanvasLocation(
      piece,
      x * this.tileSize + (this.tileSize * (1 - this.pieceTileScaleFactor)) / 2,
      y * this.tileSize + (this.tileSize * (1 - this.pieceTileScaleFactor)) / 2,
    )
  }

  renderPieceByCenterCanvasLocation(piece, x, y) {
    this.renderPieceByCanvasLocation(
      piece,
      x - .5 * this.tileSize * this.pieceTileScaleFactor,
      y - .5 * this.tileSize * this.pieceTileScaleFactor,
    )
  }
}