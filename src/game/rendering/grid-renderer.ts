import config from '@/game/models/config.json'
import {Coordinate} from "@/types";

export class GridRenderer {
  private readonly canvas: HTMLCanvasElement
  private readonly tileSize: number

  constructor(canvas: HTMLCanvasElement, tileSize: number) {
    this.canvas = canvas
    this.tileSize = tileSize
  }


  renderGrid() {
    for(let i = 0; i < config.tileCount; i++) {
      for(let j = 0; j < config.tileCount; j++) {
        this.renderTile(i, j)
      }
    }
  }

  renderTile(x: number, y: number) {
    const ctx = this.canvas.getContext("2d");
    if(!ctx) {
      throw new Error('Canvas context not found');
    }
    ctx.fillStyle = (x + y) % 2 === 0 ? config.blackTilesColor : config.whiteTilesColor
    ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize)
  }

  renderPossibleMove({x, y}: Coordinate) {
    const ctx = this.canvas.getContext("2d");
    if(!ctx) {
      throw new Error('Canvas context not found');
    }
    ctx.fillStyle = (x + y) % 2 === 0 ? config.blackTilesMoveIndicationColor : config.whiteTilesMoveIndicationColor
    ctx.beginPath();

    ctx.arc((x + .5) * this.tileSize, (y + .5) * this.tileSize, 10, 0, 2 * Math.PI, true);

    ctx.fill();
  }

  renderPossibleCapture({ x, y }: Coordinate) {
    const ctx = this.canvas.getContext("2d");
    if(!ctx) {
      throw new Error('Canvas context not found');
    }
    ctx.save();
    ctx.beginPath();

    ctx.arc((x + .5) * this.tileSize, (y + .5) * this.tileSize, this.tileSize * .45, 0, Math.PI * 2, false);

    ctx.arc((x + .5) * this.tileSize, (y + .5) * this.tileSize, this.tileSize * .40, 0, Math.PI * 2, true);

    ctx.closePath();
    ctx.fillStyle = config.whiteTilesMoveIndicationColor;
    ctx.fill();
    ctx.restore();
  }
}