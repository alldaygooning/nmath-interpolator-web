export class Form {
	constructor() {
		this.expressionField = document.getElementById('differential-equation');
		this.intervalLeftField = document.getElementById('left-endpoint');
		this.intervalRightField = document.getElementById('right-endpoint');
		this.initialField = document.getElementById('initial-value');
		this.stepField = document.getElementById('step');
		this.precisionField = document.getElementById('precision');
		this.methodCheckboxes = document.querySelectorAll('.method-checkbox');
	}

	getJsonData() {
		const expression = this.expressionField.value.trim() || 'y+(1+x)y^2';
		const left = this.intervalLeftField.value.trim() || '1';
		const right = this.intervalRightField.value.trim() || '1.5';
		const y = this.initialField.value.trim() || '-1';
		const step = this.stepField.value.trim() || '0.1';
		const precision = this.precisionField.value.trim() || '0.001';

		const methods = [];
		this.methodCheckboxes.forEach(checkbox => {
			if (checkbox.checked) {
				methods.push(checkbox.value);
			}
		});

		return {
			expression,
			left,
			right,
			y,
			step,
			precision,
			methods
		};
	}

}
