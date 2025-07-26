export class MouseController {
  constructor(gameEngine) {
    this.gameEngine = gameEngine
    this.isMouseDown = false
  }

  listen(el) {
    this.el = el
    this.id = Math.random()
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundMouseLeave = this.onMouseLeave.bind(this);

    el.addEventListener("mousemove", this.boundMouseMove);
    el.addEventListener("mouseup", this.boundMouseUp);
    el.addEventListener("mousedown", this.boundMouseDown);
    el.addEventListener("mouseleave", this.boundMouseLeave);
  }

  onMouseDown(e) {
    this.isMouseDown = true;
    this.gameEngine.grab(e.offsetX, e.offsetY)
  }

  onMouseMove(e) {
    if(this.isMouseDown){
      this.gameEngine.move(e.offsetX, e.offsetY)
    }
    if(!this.isMouseDown) {
      this.gameEngine.hover(e.offsetX, e.offsetY)
    }
  }

  onMouseUp(e) {
    this.isMouseDown = false;
    this.gameEngine.drop(e.offsetX, e.offsetY)
  }

  onMouseLeave() {
    this.isMouseDown = false
    this.gameEngine.discardSelection()
  }

  destroy() {
    this.el.removeEventListener("mousemove", this.boundMouseMove);
    this.el.removeEventListener("mouseup", this.boundMouseUp);
    this.el.removeEventListener("mousedown", this.boundMouseDown);
    this.el.removeEventListener("mouseleave", this.boundMouseLeave);
  }


}