export class SendButton {
	constructor(modal, table) {
		this.modal = modal;
		this.table = table;
		this.buttonElement = null;
		this.serverUrl = '';
	}

	setButtonElement(element) {
		this.buttonElement = element;
		this.buttonElement.addEventListener('click', () => this.handleClick());
	}

	async handleClick() {
		this.serverUrl = document.querySelector('#serverUrl').value;

		if (!this.serverUrl) {
			alert('Please enter a server URL');
			return;
		}

		const formData = this.modal.getFormData();
		const requestData = {
			expression: String(formData.expression),
			n: String(formData.numPoints),
			left: String(formData.leftBorder),
			right: String(formData.rightBorder)
		};

		try {
			const response = await this.sendData(requestData);
			console.log('Server response:', response);

			if (response.successful) {
				this.updateTableWithPoints(response.points);
			} else {
				alert(response.message || 'Failed to generate points');
			}

			this.modal.close();
		} catch (error) {
			console.error('Error sending data:', error);
			alert(error.message || 'Failed to send data to server');
		}
	}

	async sendData(data) {
		const response = await fetch(this.serverUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
		}

		return await response.json();
	}

	updateTableWithPoints(points) {
		this.table.clear();

		this.table.setRows(points.length);

		points.forEach((point, index) => {
			const xInput = document.getElementById(`x-${index + 1}`);
			const yInput = document.getElementById(`y-${index + 1}`);

			if (xInput && yInput) {
				xInput.value = point.x.toString();
				yInput.value = point.y.toString();
				this.table.updatePoint(index + 1);
			}
		});
	}
}