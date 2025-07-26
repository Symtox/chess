import config from '/src/game/models/config.json'
import {spriteHandler} from "./sprites/sprite-handler.js";

export class PromotionTooltipRenderer {
  constructor(canvas, tileSize) {
    this.canvas = canvas
    this.tileSize = tileSize
  }

  renderTooltip(x) {
    const itemSize = this.tileSize * 0.7
    const itemCount = 4
    const margin = this.tileSize * .1
    const top = this.tileSize + margin

    const closeSize = 40
    const size = itemSize * itemCount + closeSize

    const minX = Math.max(margin, (x + 0.5) * this.tileSize - size / 2)
    const leftOffset = Math.min(minX, (config.tileCount) * this.tileSize - (size + margin))

    const ctx = this.canvas.getContext("2d")
    ctx.save()
    ctx.globalAlpha = 0.8;

    ctx.fillStyle = "#F7F3E3"
    ctx.strokeStyle = "grey"

    ctx.beginPath();
    ctx.roundRect(leftOffset, top, size, itemSize, 2)
    ctx.closePath();

    ctx.fill()
    ctx.restore()

    ctx.stroke()


    this.renderChoice("PAWN", leftOffset, top, itemSize)
    this.renderChoice("BISHOP", leftOffset + itemSize, top, itemSize)
    this.renderChoice("KNIGHT", leftOffset + itemSize * 2, top, itemSize)
    this.renderChoice("ROOK", leftOffset + itemSize * 3, top, itemSize)
    this.renderCloseArrow(leftOffset + itemSize * 4 + closeSize / 2, top + itemSize / 2, 10)
  }

  renderChoice(piece, left, top, size) {
    const margin = size / 8
    const padding = size / 10

    const itemTop = top + margin
    const itemLeft = left + margin
    const itemSize = size - 2 * margin

    const ctx = this.canvas.getContext("2d")

    const innerSize = size - margin * 2
    ctx.save()

    ctx.strokeStyle = "black"
    ctx.globalAlpha = 0.8;

    ctx.fillStyle = "#white"

    ctx.beginPath();
    ctx.roundRect(itemLeft, itemTop, innerSize, innerSize, 4)
    ctx.closePath();

    ctx.stroke()
    ctx.fill()

    ctx.restore()


    const positionInSprite = spriteHandler.getPieceCoordinate(piece, "black");
    ctx.drawImage(
      spriteHandler.getSprite(),
      positionInSprite.x,
      positionInSprite.y,
      positionInSprite.width,
      positionInSprite.height,
      itemLeft + padding,
      itemTop + padding,
      itemSize - 2 * padding,
      itemSize - 2 * padding,
    )
  }

  renderCloseArrow(x, y, size) {

    const color = "black", lineWidth = 2
    const ctx = this.canvas.getContext('2d')
    ctx.save()
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    // Draw the two crossing lines
    ctx.beginPath();
    ctx.moveTo(x - size / 2, y - size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + size / 2, y - size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.stroke();

    ctx.restore()
    }
}