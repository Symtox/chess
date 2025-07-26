import config from "/src/game/models/config.json"
class CoordinateAdapter {
  init(elWidth, elHeight, canvasWidth, canvasHeight) {
    this.elWidth = elWidth;
    this.elHeight = elHeight
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  fromDomToGrid(pos) {
    return this.fromCanvasToGrid(this.fromDomToCanvas(pos))
  }

  fromDomToCanvas({x, y}) {
    return {
      x: x * (this.canvasWidth / this.elWidth),
      y: y * (this.canvasHeight / this.elHeight)
    }
  }

  fromCanvasToGrid({x, y}) {
    return {
      x: Math.floor(x / (this.canvasWidth / config.tileCount)),
      y: Math.floor(y / (this.canvasHeight / config.tileCount))
    }
  }
}


export const coordinateAdapter = new CoordinateAdapter()
