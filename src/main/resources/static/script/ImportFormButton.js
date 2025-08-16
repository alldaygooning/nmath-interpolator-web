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
		if (!data || typeof data !== "object") {
			alert("Invalid data in JSON file.");
			return;
		}
		const { count, points, methods, x } = data;

		this.form.table.clear();
		this.form.table.setRows(count);

		const tableElem = this.form.table.table;
		if (tableElem.rows.length < 2) {
			alert("The point table does not have the expected structure.");
			return;
		}
		const xRow = tableElem.rows[0];
		const yRow = tableElem.rows[1];

		for (let i = 1; i < xRow.cells.length; i++) {
			const point = points[i - 1];
			const xVal = point && point.x ? point.x : "";
			const yVal = point && point.y ? point.y : "";

			const xInput = xRow.cells[i].querySelector("input");
			const yInput = yRow.cells[i].querySelector("input");

			if (xInput) xInput.value = xVal;
			if (yInput) yInput.value = yVal;
		}

		this.form.checkboxes.forEach(checkbox => {
			checkbox.checked = false;
		});
		
		if (Array.isArray(methods)) {
			this.form.checkboxes.forEach(checkbox => {
				if (methods.includes(checkbox.value)) {
					checkbox.checked = true;
				}
			});
		}

		if (this.form.table.numberSpinbox) {
			this.form.table.numberSpinbox.value = count;
		}
		
		if (this.form.xFieldElement && x !== undefined) {
			this.form.xFieldElement.value = x;
		}

		for(let i = 0; i < count; i++){
			this.form.table.updatePoint(i);
		}
	}
}
