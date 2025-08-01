import { GridRenderer } from "./grid-renderer";
import { PieceRender } from "./piece-render";
import config from "@/game/models/config.json";
import { PromotionTooltipRenderer } from "./promotion-tooltip-renderer";
import { GameState } from "@/game/models/game-state";
import { getMoveIndicationCoordinates, isCastle } from "@/types/types";

export class Renderer {
  private gridRenderer: GridRenderer;
  private pieceRenderer: PieceRender;
  private promotionRenderer: PromotionTooltipRenderer;

  constructor(canvas: HTMLCanvasElement) {
    const tileSize = canvas.width / config.tileCount;
    this.gridRenderer = new GridRenderer(canvas, tileSize);
    this.pieceRenderer = new PieceRender(canvas, tileSize);
    this.promotionRenderer = new PromotionTooltipRenderer(canvas, tileSize);
  }

  render(gameState: GameState) {
    this.gridRenderer.renderGrid();
    this.renderPieces(gameState);

    if (gameState.getSelection()) {
      this.renderMoves(gameState);
      this.renderSelection(gameState);
    }

    return;
  }

  renderPieces(gameState: GameState) {
    gameState.game.board.forEach((col, x) => {
      col.forEach((cell, y) => {
        if (!cell) return;

        if (
          !gameState.getSelection() ||
          cell !== gameState.getSelection().piece
        ) {
          this.pieceRenderer.renderPieceByGridPosition(cell, x, y);
        }
      });
    });
  }

  renderMoves(gameState: GameState) {
    gameState.allowedMoves.forEach((move) => {
      if (isCastle(move) || !move.capture) {
        this.gridRenderer.renderPossibleMove(
          getMoveIndicationCoordinates(move),
        );
      } else if (move.capture) {
        this.gridRenderer.renderPossibleCapture(
          getMoveIndicationCoordinates(move),
        );
      }
    });
  }

  renderSelection(gameState: GameState) {
    this.pieceRenderer.renderPieceByCenterCanvasLocation(
      gameState.getSelection().piece,
      gameState.getSelection().x,
      gameState.getSelection().y,
    );
  }
}
