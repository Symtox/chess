export class EndGameDialogAdapter {
  constructor(dialog, resetCallback) {
    this.dialog = dialog
    this.resetCallback = resetCallback
    this.dialog.querySelector('#close').addEventListener('click', this.closeAndReset.bind(this))
  }

  show(message, subtitle) {
    this.dialog.querySelector('#modal-title').innerText = message
    this.dialog.querySelector('#modal-subtitle').innerText = subtitle
    this.dialog.showModal()
  }

  destroy() {
    this.dialog.querySelector('#close').removeEventListener('click', () => this.dialog.close())
  }

  closeAndReset() {
    this.resetCallback()
    this.dialog.close()
  }
}