import config from "../../models/config.json";

class SpriteHandler {

  spritePieceOrder = [
    'KING',
    "QUEEN",
    "BISHOP",
    "KNIGHT",
    "ROOK",
    "PAWN"
  ]


  constructor() {
    this.sprite = new Image()
    this.sprite.src = '/pieces-sprite.png'
  }

  getPieceCoordinate(pieceType, color) {
    const pieceSizeInSprite = {
      width: this.sprite.naturalWidth / config.pieceCount,
      height: this.sprite.naturalHeight / 2
    }

    const pieceX = this.spritePieceOrder.findIndex((type) => type === pieceType) * pieceSizeInSprite.width
    const pieceY = color === 'black' ? this.sprite.naturalHeight / 2 : 0

    return { x: pieceX, y: pieceY, width: pieceSizeInSprite.width, height: pieceSizeInSprite.height }
  }

  getSprite() {
    return this.sprite
  }
}

export const spriteHandler = new SpriteHandler()