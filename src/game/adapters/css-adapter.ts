export class CssAdapter {
  changeCursor(cursor: string) {
    const gameView = document.querySelector('#game-view') as HTMLElement;
    if (!gameView) {
      console.error('Game view element not found');
      return;
    }
    gameView.style.cursor = cursor;
  }
}