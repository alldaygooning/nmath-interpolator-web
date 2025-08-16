
export class Form {
	constructor(table, checkboxes, xElement) {
		this.table = table;
		this.checkboxes = checkboxes;
		this.xFieldElement = xElement;
	}

	getJsonData() {
		const methods = this.checkboxes
			.filter(checkbox => checkbox.checked)
			.map(checkbox => checkbox.value);

		const points = [];
		const tableElem = this.table.table;
		let count = 0;
		if (tableElem.rows.length >= 2) {
			const xRow = tableElem.rows[0];
			const yRow = tableElem.rows[1];
			count = xRow.cells.length - 1;
			for (let i = 1; i < xRow.cells.length; i++) {
				const xInput = xRow.cells[i].querySelector("input");
				const yInput = yRow.cells[i].querySelector("input");
				const xVal = xInput && xInput.value.trim() !== "" ? xInput.value : "1";
				const yVal = yInput && yInput.value.trim() !== "" ? yInput.value : "1";
				points.push({ x: xVal, y: yVal });
			}
		}

		const x = this.xFieldElement && this.xFieldElement.value.trim() !== ""
			? this.xFieldElement.value
			: "0.25";

		return {
			methods: methods,
			points: points,
			count: count,
			x: x
		};
	}

	getPoints() {
		return this.table.getPoints();
	}
}
