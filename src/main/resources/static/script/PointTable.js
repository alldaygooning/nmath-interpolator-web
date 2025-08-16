export class PointTable {
	constructor(table, calculator) {
		this.table = table;
		this.calculator = calculator;
	}

	clear() {
		for (let rowIndex = 0; rowIndex < this.table.rows.length; rowIndex++) {
			const row = this.table.rows[rowIndex];
			for (let cellIndex = 1; cellIndex < row.cells.length; cellIndex++) {
				const cell = row.cells[cellIndex];
				const input = cell.querySelector("input");
				if (input) {
					input.value = "";
					input.placeholder = "";
					this.updatePoint(cellIndex);
				}
			}
		}
	}

	setRows(numRows) {
		const newTotalCells = numRows + 1;
		const currentTotalCells = this.table.rows[0].cells.length;

		if (newTotalCells === currentTotalCells) {
			return;
		}

		if (newTotalCells > currentTotalCells) {
			for (let i = currentTotalCells; i < newTotalCells; i++) {
				const xCell = this.table.rows[0].insertCell();
				const xInput = document.createElement("input");
				xInput.type = "text";
				xInput.id = `x-${i}`;
				xInput.dataset.index = i;
				xInput.placeholder = "";
				xInput.classList.add("point-input");
				xInput.addEventListener("input", (event) => {
					this.updatePoint(parseInt(event.target.dataset.index));
				});
				xCell.appendChild(xInput);

				const yCell = this.table.rows[1].insertCell();
				const yInput = document.createElement("input");
				yInput.type = "text";
				yInput.id = `y-${i}`;
				yInput.dataset.index = i;
				yInput.placeholder = "";
				yInput.classList.add("point-input");
				yInput.addEventListener("input", (event) => {
					this.updatePoint(parseInt(event.target.dataset.index));
				});
				yCell.appendChild(yInput);

				this.updatePoint(i);
			}
		} else if (newTotalCells < currentTotalCells) {
			for (let i = currentTotalCells - 1; i >= newTotalCells; i--) {
				this.calculator.removePoint(`point-${i}`);
				this.table.rows[0].deleteCell(i);
				this.table.rows[1].deleteCell(i);
			}
		}
	}

	fill() {
		for (let i = 1; i < this.table.rows[0].cells.length; i++) {
			const xCell = this.table.rows[0].cells[i];
			const xInput = xCell.querySelector("input");
			if (xInput) {
				xInput.value = "";
				xInput.placeholder = "";
			}

			const yCell = this.table.rows[1].cells[i];
			const yInput = yCell.querySelector("input");
			if (yInput) {
				yInput.value = "";
				yInput.placeholder = "";
			}

			this.updatePoint(i);
		}
	}

	updatePoint(index) {
		const xInput = document.getElementById(`x-${index}`);
		const yInput = document.getElementById(`y-${index}`);

		if (!xInput || !yInput) {
			return;
		}

		const xValue = xInput.value.trim();
		const yValue = yInput.value.trim();

		const pointId = `point-${index}`;

		if (xValue === "" || yValue === "") {
			this.calculator.removePoint(pointId);
			return;
		}

		const x = parseFloat(xValue);
		const y = parseFloat(yValue);

		if (isNaN(x) || isNaN(y)) {
			this.calculator.removePoint(pointId);
			return;
		}

		this.calculator.addPoint(x, y, pointId);
	}

	getPoints() {
		let points = [];
		const numCells = this.table.rows[0].cells.length;
		for (let i = 1; i < numCells; i++) {
			const xInput = document.getElementById(`x-${i}`);
			const yInput = document.getElementById(`y-${i}`);

			if (!xInput || !yInput) {
				continue;
			}

			const xValue = parseFloat(xInput.value.trim());
			const yValue = parseFloat(yInput.value.trim());

			if (!isNaN(xValue) && !isNaN(yValue)) {
				points.push({ x: xValue, y: yValue });
			}
		}
		return points;
	}
}
