import {GridRenderer} from "./grid-renderer.js";
import {PieceRender} from "./piece-render.js";
import config from '/src/game/models/config.json'
import {Castle} from "../engine/moves/castle.js";
import {PromotionTooltipRenderer} from "./promotion-tooltip-renderer.js";
export class Renderer {

  constructor(canvas) {
    const tileSize = canvas.width / config.tileCount
    this.gridRenderer = new GridRenderer(canvas, tileSize)
    this.pieceRenderer = new PieceRender(canvas, tileSize)
    this.promotionRenderer = new PromotionTooltipRenderer(canvas, tileSize)
  }

  render(gameState) {
    this.gridRenderer.renderGrid()
    this.renderPieces(gameState)

    if(gameState.getSelection()) {
      this.renderMoves(gameState)
      this.renderSelection(gameState)
    }
    this.renderPromotion(3)

    return;
    if(gameState.getSelection() && gameState.getSelection().promotion) {
      this.renderPromotion(gameState.getSelection().promotion.x)
    }
  }

  renderPieces(gameState) {
    gameState.grid.grid.forEach((col, x) => {
      col.forEach((cell, y) => {
        if(!cell) return

        if(!gameState.getSelection() || cell !== gameState.getSelection().piece) {
          this.pieceRenderer.renderPieceByGridPosition(cell, x, y)
        }
      })
    })
  }

  renderMoves(gameState) {
    gameState.allowedMoves.forEach((move) => {
      if(move.capture) {
        this.gridRenderer.renderPossibleCapture(move.getMoveIndicationCoordinates())
      } else {
        this.gridRenderer.renderPossibleMove(move.getMoveIndicationCoordinates())
      }
    })
  }

  renderSelection(gameState) {
    this.pieceRenderer.renderPieceByCenterCanvasLocation(
      gameState.getSelection().piece,
      gameState.getSelection().x,
      gameState.getSelection().y
    )
  }

  //TODO
  renderPromotion(x) {
    //this.promotionRenderer.renderTooltip(x)
  }
}