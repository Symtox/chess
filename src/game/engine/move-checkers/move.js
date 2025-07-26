export class Move {
  constructor(from, to, piece, capture, color) {
    this.to = to
    this.from = from
    this.piece = piece
    this.capture = capture
    this.color = color ?? this.piece.color
  }

  getMoveIndicationCoordinates() {
    return this.to
  }
}