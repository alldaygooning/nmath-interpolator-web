export class ExportFormButton {
	constructor(button, form) {
		this.button = button;
		this.form = form;

		this.#addEventListeners();
	}

	#addEventListeners() {
		this.button.addEventListener("click", () => {
			const jsonData = this.form.getJsonData();
			const jsonString = JSON.stringify(jsonData, null, 2);
			const blob = new Blob([jsonString], { type: "application/json" });
			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = "form-data.json";
			document.body.appendChild(a);
			a.click();

			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		});
	}
}