import { spriteHandler } from "./sprites/sprite-handler";
import { Piece } from "@/types/types";

export class PieceRender {
  pieceTileScaleFactor = 0.75;
  private readonly tileSize: number;
  private readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, tileSize: number) {
    this.canvas = canvas;
    this.tileSize = tileSize;
  }

  renderPieceByCanvasLocation(piece: Piece, x: number, y: number) {
    const positionInSprite = spriteHandler.getPieceCoordinate(
      piece.type,
      piece.color,
    );
    const ctx = this.canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      spriteHandler.getSprite(),
      positionInSprite.x,
      positionInSprite.y,
      positionInSprite.width,
      positionInSprite.height,
      x,
      y,
      this.tileSize * this.pieceTileScaleFactor,
      this.tileSize * this.pieceTileScaleFactor,
    );
  }

  renderPieceByGridPosition(piece: Piece, x: number, y: number) {
    this.renderPieceByCanvasLocation(
      piece,
      x * this.tileSize + (this.tileSize * (1 - this.pieceTileScaleFactor)) / 2,
      y * this.tileSize + (this.tileSize * (1 - this.pieceTileScaleFactor)) / 2,
    );
  }

  renderPieceByCenterCanvasLocation(piece: Piece, x: number, y: number) {
    this.renderPieceByCanvasLocation(
      piece,
      x - 0.5 * this.tileSize * this.pieceTileScaleFactor,
      y - 0.5 * this.tileSize * this.pieceTileScaleFactor,
    );
  }
}
