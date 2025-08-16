export class ImportFormButton {
	constructor(button, form) {
		this.button = button;
		this.form = form;
		this.#addEventListeners();
	}

	#addEventListeners() {
		this.button.addEventListener("click", () => {
			const fileInput = document.createElement("input");
			fileInput.type = "file";
			fileInput.accept = ".json";
			fileInput.style.display = "none";
			document.body.appendChild(fileInput);

			fileInput.addEventListener("change", (event) => {
				const file = event.target.files[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = (e) => {
						try {
							const result = JSON.parse(e.target.result);
							this.#importData(result);
						} catch (error) {
							alert("Failed to parse JSON file. Please check the file format.");
							console.error("JSON parse error:", error);
						}
						document.body.removeChild(fileInput);
					};
					reader.readAsText(file);
				} else {
					document.body.removeChild(fileInput);
				}
			});

			fileInput.click();
		});
	}

	#importData(data) {
		if (data.expression) this.form.expressionField.value = data.expression;
		if (data.left) this.form.intervalLeftField.value = data.left;
		if (data.right) this.form.intervalRightField.value = data.right;
		if (data.y) this.form.initialField.value = data.y;
		if (data.step) this.form.stepField.value = data.step;
		if (data.precision) this.form.precisionField.value = data.precision;

		if (data.methods && Array.isArray(data.methods)) {
			this.form.methodCheckboxes.forEach(checkbox => {
				checkbox.checked = false;
			});

			data.methods.forEach(method => {
				const checkbox = Array.from(this.form.methodCheckboxes).find(
					cb => cb.value === method
				);
				if (checkbox) {
					checkbox.checked = true;
				}
			});
		}
	}
}