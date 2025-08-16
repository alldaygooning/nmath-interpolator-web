import { FillTableModal } from "./FillTableModal.js"

export class FillTableButton {
	constructor(button, table) {
		this.button = button;
		this.table = table;

		this.#addEventListeners();
	}

	#addEventListeners() {
		this.button.addEventListener("click", () => {
			const modal = new FillTableModal(this.table);
			modal.open();
		});
	}
}