import config from "@/game/models/config.json";
import { Coordinate } from "@/types/types";

class CoordinateAdapter {
  private elWidth: number = 0;
  private elHeight: number = 0;
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;

  init(
    elWidth: number,
    elHeight: number,
    canvasWidth: number,
    canvasHeight: number,
  ) {
    this.elWidth = elWidth;
    this.elHeight = elHeight;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  fromDomToGrid(pos: Coordinate) {
    return this.fromCanvasToGrid(this.fromDomToCanvas(pos));
  }

  fromDomToCanvas({ x, y }: Coordinate) {
    return {
      x: x * (this.canvasWidth / this.elWidth),
      y: y * (this.canvasHeight / this.elHeight),
    };
  }

  fromCanvasToGrid({ x, y }: Coordinate) {
    return {
      x: Math.floor(x / (this.canvasWidth / config.tileCount)),
      y: Math.floor(y / (this.canvasHeight / config.tileCount)),
    };
  }
}

export const coordinateAdapter = new CoordinateAdapter();
