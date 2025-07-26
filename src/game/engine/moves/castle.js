import {Move} from "../move-checkers/move.js";
import {Coordinate} from "../../../utils/coordinate.js";

export class Castle extends Move {
  constructor(color, type) {
    super(null, null, null, null, color);
    this.color = color
    this.type = type
  }

  getMoveIndicationCoordinates() {
    const kingY = this.color === "black" ? 0 : 7
    if(this.type === "long") {
      return new Coordinate(2, kingY)
    } else {
      return new Coordinate(6, kingY)

    }
  }
}
