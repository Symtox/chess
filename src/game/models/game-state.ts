import {Castle, isCastle, Move} from "@/types/types";
import {defaultGame, Game} from "@/types/game";
export class GameState {
  public game: Game;
  private selection: any;
  public allowedMoves: Move[] = [];

  constructor() {
    this.game = defaultGame()
    this.selection = undefined;
  }

  getSelection() {
    return this.selection;
  }

  setSelection(selection: any, allowedMoves: Move[]) {
    this.selection = selection;
    this.allowedMoves = allowedMoves;
  }


}
