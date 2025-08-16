export class NumberSpinbox {
	constructor(spinbox, table, defaultValue) {
		this.spinbox = spinbox;
		this.table = table;
		this.defaultValue = defaultValue;

		if (!this.spinbox.value) {
			this.spinbox.value = this.defaultValue;
		}

		this.min = this.spinbox.min;
		this.max = this.spinbox.max;

		this.spinbox.addEventListener("blur", this.checkBounds.bind(this));
		this.spinbox.addEventListener("change", this.checkBounds.bind(this));

		this.#refreshTable();
	}

	checkBounds() {
		let value = parseInt(this.spinbox.value, 10);

		if (isNaN(value)) {
			this.spinbox.value = this.defaultValue;
			return;
		}

		if (value < this.min) {
			this.spinbox.value = this.min;
		} else if (value > this.max) {
			this.spinbox.value = this.max;
		}
		this.#refreshTable();
	}

	#refreshTable() {
		this.table.setRows(parseInt(this.spinbox.value, 10));
	}
}

export function isNumberKey(evt) {
	var charCode = evt.which ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	return true;
}
