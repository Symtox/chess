export class EndGameDialogAdapter {
  private dialog: HTMLDialogElement;
  private closeBtnEl: HTMLElement;
  private titleEl: HTMLElement;
  private subtitleEl: HTMLElement;
  private readonly resetCallback: () => void;

  constructor(dialog: HTMLDialogElement, resetCallback: () => void) {
    this.dialog = dialog;

    this.titleEl = dialog.querySelector("#modal-title") as HTMLElement;
    this.subtitleEl = dialog.querySelector("#modal-subtitle") as HTMLElement;
    this.closeBtnEl = dialog.querySelector("#close") as HTMLElement;

    this.resetCallback = resetCallback;
    this.closeBtnEl.addEventListener("click", this.closeAndReset.bind(this));
  }

  show(message: string, subtitle: string) {
    this.titleEl.innerText = message;
    this.subtitleEl.innerText = subtitle;
    this.dialog.showModal();
  }

  destroy() {
    this.closeBtnEl.removeEventListener("click", () => this.dialog.close());
  }

  closeAndReset() {
    this.resetCallback();
    this.dialog.close();
  }
}
