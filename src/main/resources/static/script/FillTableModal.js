import { SendButton } from "./SendButton.js";

export class FillTableModal {
	constructor(table) {
		this.table = table;
		this.sendButton = new SendButton(this, this.table);
		this.modalElement = this.#createModal();
	}

	open() {
		document.body.appendChild(this.modalElement);
	}

	close() {
		document.body.removeChild(this.modalElement);
	}

	getFormData() {
		return {
			expression: this.modalElement.querySelector('#expression').value,
			numPoints: this.modalElement.querySelector('#numPoints').value,
			leftBorder: this.modalElement.querySelector('#leftBorder').value,
			rightBorder: this.modalElement.querySelector('#rightBorder').value
		};
	}

	#createModal() {
		const modal = document.createElement('div');
		modal.className = 'fill-table-modal';

		const modalContent = document.createElement('div');
		modalContent.className = 'fill-table-modal-content';

		const title = document.createElement('h2');
		title.className = 'fill-table-modal-title';
		title.textContent = 'Fill Table Parameters';
		modalContent.appendChild(title);

		const expressionLabel = document.createElement('label');
		expressionLabel.className = 'fill-table-modal-label';
		expressionLabel.textContent = 'Expression:';
		expressionLabel.htmlFor = 'expression';
		modalContent.appendChild(expressionLabel);

		const expressionInput = document.createElement('input');
		expressionInput.type = 'text';
		expressionInput.id = 'expression';
		expressionInput.className = 'fill-table-modal-input';
		expressionInput.placeholder = 'e.g., x^2 + 2*x + 1';
		modalContent.appendChild(expressionInput);

		const numPointsLabel = document.createElement('label');
		numPointsLabel.className = 'fill-table-modal-label';
		numPointsLabel.textContent = 'Number of Points:';
		numPointsLabel.htmlFor = 'numPoints';
		modalContent.appendChild(numPointsLabel);

		const numPointsInput = document.createElement('input');
		numPointsInput.type = 'number';
		numPointsInput.id = 'numPoints';
		numPointsInput.className = 'fill-table-modal-input';
		numPointsInput.min = '2';
		numPointsInput.value = '10';
		modalContent.appendChild(numPointsInput);

		const leftBorderLabel = document.createElement('label');
		leftBorderLabel.className = 'fill-table-modal-label';
		leftBorderLabel.textContent = 'Left Border:';
		leftBorderLabel.htmlFor = 'leftBorder';
		modalContent.appendChild(leftBorderLabel);

		const leftBorderInput = document.createElement('input');
		leftBorderInput.type = 'number';
		leftBorderInput.id = 'leftBorder';
		leftBorderInput.className = 'fill-table-modal-input';
		leftBorderInput.value = '-10';
		modalContent.appendChild(leftBorderInput);

		const rightBorderLabel = document.createElement('label');
		rightBorderLabel.className = 'fill-table-modal-label';
		rightBorderLabel.textContent = 'Right Border:';
		rightBorderLabel.htmlFor = 'rightBorder';
		modalContent.appendChild(rightBorderLabel);

		const rightBorderInput = document.createElement('input');
		rightBorderInput.type = 'number';
		rightBorderInput.id = 'rightBorder';
		rightBorderInput.className = 'fill-table-modal-input';
		rightBorderInput.value = '10';
		modalContent.appendChild(rightBorderInput);

		const urlLabel = document.createElement('label');
		urlLabel.className = 'fill-table-modal-label';
		urlLabel.textContent = 'Server URL:';
		urlLabel.htmlFor = 'serverUrl';
		modalContent.appendChild(urlLabel);

		const urlInput = document.createElement('input');
		urlInput.type = 'text';
		urlInput.id = 'serverUrl';
		urlInput.className = 'fill-table-modal-input';
		urlInput.placeholder = 'https://example.com/api/endpoint';
		modalContent.appendChild(urlInput);

		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'fill-table-modal-button-container';

		const closeButton = document.createElement('button');
		closeButton.className = 'fill-table-modal-button fill-table-modal-close-button';
		closeButton.textContent = 'Close';
		closeButton.addEventListener('click', () => this.close());
		buttonContainer.appendChild(closeButton);

		const sendButtonElement = document.createElement('button');
		sendButtonElement.className = 'fill-table-modal-button fill-table-modal-send-button';
		sendButtonElement.textContent = 'Send';
		this.sendButton.setButtonElement(sendButtonElement);
		buttonContainer.appendChild(sendButtonElement);

		modalContent.appendChild(buttonContainer);
		modal.appendChild(modalContent);

		return modal;
	}
}