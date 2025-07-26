export class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color
    this.hasMoved = false
  }

  clone() {
    return new Piece(this.type, this.color)
  }
}

