import { ChessGame } from "./game/chess-game.js";
import {Clock} from "./components/clock/clock.js";
const canvas = document.querySelector("#game-view")
if(!canvas) {
  throw new Error('canvas not found')
}
customElements.define('clock-el', Clock);


const game = new ChessGame();
game.init(canvas)
game.start();