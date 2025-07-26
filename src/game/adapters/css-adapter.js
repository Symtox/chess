export class CssAdapter {
  changeCursor(cursor) {
    document.querySelector('#game-view').style.cursor = cursor
  }
}