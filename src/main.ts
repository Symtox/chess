import { ChessGame } from "@/game/chess-game";
import { Clock } from "@/components/clock/clock";
const canvas = document.querySelector("#game-view");
if (!canvas) {
  throw new Error("canvas not found");
}
customElements.define("clock-el", Clock);

const game = new ChessGame(canvas as HTMLCanvasElement);

game.start();
