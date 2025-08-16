window.mathJaxQueue = window.mathJaxQueue || [];

function safeTypeset() {
	return new Promise((resolve) => {
		if (window.mathJaxReady) {
			MathJax.typesetPromise().then(resolve);
		} else {
			window.mathJaxQueue.push(() => {
				MathJax.typesetPromise().then(resolve);
			});
		}
	});
}

export class SolutionDisplay {
	constructor(container, calculator) {
		this.container = container;
		this.backButton = this.container.querySelector('#nav-back-button');
		this.forwardButton = this.container.querySelector('#nav-forward-button');
		this.pageName = this.container.querySelector("#page-name");
		this.pageNumber = this.container.querySelector("#page-number");
		this.calculator = calculator;

		this.pages = [];
		this.currentPage = -1;

		this.#addEventListeners();
		this.#addDownloadEventListener();
	}

	#addEventListeners() {
		this.backButton.addEventListener("click", () => {
			if (this.currentPage === -1) return;
			this.move(1);
			this.updateCount();
		});

		this.forwardButton.addEventListener("click", () => {
			if (this.currentPage === -1) return;
			this.move(-1);
			this.updateCount();
		});
	}

	#addDownloadEventListener() {
		this.container.addEventListener('click', (e) => {
			if (e.target.closest('#nav-back-button') ||
				e.target.closest('#nav-forward-button') ||
				e.target.closest('.always-display-checkbox')) {
				return;
			}
			this.downloadJson();
		});
	}

	clear() {
		for (let i = 0; i < this.pages.length; i++) {
			this.calculator.remove(i);
		}
		this.pages = [];
		this.currentPage = -1;
	}

	add(page) {
		this.pages.push(page);
		this.move(1);
		this.updateCount();
		if (page.successful) {
			this.calculator.set(page.approximation.getApproximated(), this.currentPage);
			this.calculator.set(page.approximation.getActual(), `${this.currentPage}-actual`);
			this.updateGraphDisplay();
		}
	}

	async display(page) {
		const currentSolution = this.container.querySelector(".solution");
		if (currentSolution) currentSolution.remove();

		this.pageName.innerText = page.getName();

		const newSolution = document.createElement("div");
		newSolution.classList.add("solution");
		newSolution.innerHTML = page.getElement();
		this.container.appendChild(newSolution);

		const checkbox = newSolution.querySelector('.always-display-checkbox');
		if (checkbox) {
			checkbox.addEventListener('change', (e) => {
				page.alwaysDisplay = e.target.checked;
				this.updateGraphDisplay();
			});
		}

		this.calculator.removePoints(this.currentPage);
		if (page.successful) {
			this.calculator.addPoints(page.approximation.points, this.currentPage);
		}

		await safeTypeset();
	}

	move(value) {
		this.calculator.unselect(this.currentPage);
		this.currentPage = this.currentPage + value;

		if (this.pages.length === 0) {
			this.currentPage = -1;
			return;
		} else if (this.currentPage > this.pages.length - 1) {
			this.currentPage = 0;
		} else if (this.currentPage < 0) {
			this.currentPage = this.pages.length - 1;
		}

		const page = this.pages[this.currentPage];
		this.display(page);
		this.updateGraphDisplay();
	}

	updateCount() {
		this.pageNumber.innerText = `${this.currentPage + 1}/${this.pages.length}`;
	}

	updateGraphDisplay() {
		for (let i = 0; i < this.pages.length; i++) {
			this.calculator.removePoints(i);
		}

		for (let i = 0; i < this.pages.length; i++) {
			const page = this.pages[i];
			if (page.successful) {
				this.calculator.set(page.approximation.getApproximated(), i);
				if (i === this.currentPage) {
					this.calculator.select(i);
					const points = this.#samplePoints(page.approximation.points, 20);
					this.calculator.addPoints(points, i);
				} else if (page.alwaysDisplay) {
					this.calculator.unselect(i);
				} else {
					this.calculator.remove(i);
				}
			}
			if (page.successful && i === this.currentPage) {
				this.calculator.set(page.approximation.getActual(), `${i}-actual`);
			}
		}
	}

	#samplePoints(points, maxPoints) {
		if (points.length <= maxPoints) {
			return points;
		}

		const sampledPoints = [];
		const step = Math.max(1, Math.floor(points.length / maxPoints));

		for (let i = 0; i < points.length; i += step) {
			sampledPoints.push(points[i]);
			if (sampledPoints.length >= maxPoints) {
				break;
			}
		}

		if (sampledPoints.length < maxPoints && points.length > 0) {
			sampledPoints.push(points[points.length - 1]);
		}

		return sampledPoints;
	}

	downloadJson() {

	}
}

export class SolutionPage {
	constructor(successful, approximator) {
		this.successful = successful;
		this.approximator = approximator;
		this.approximation = null;
		this.alwaysDisplay = false;
	}

	static get(successful, approximator, messageOrApproximation) {
		const page = new SolutionPage(successful, approximator);
		if (page.successful) {
			page.approximation = messageOrApproximation;
		} else {
			page.message = messageOrApproximation;
		}
		return page;
	}

	getName() {
		return this.approximator;
	}

	getElement() {
		if (this.successful) {
			return `<div class="approximation">Approximation Polynomial: $${this.approximation.getApproximated()}$</div>
					<div class="approximation">Actual Polynomial: $${this.approximation.getActual()}$</div>
					<div class="approximation">$$\\varepsilon: ${this.approximation.epsilon}$$</div>
                    <div class="display-toggle">
                        <label>
                            <input type="checkbox" class="always-display-checkbox" ${this.alwaysDisplay ? 'checked' : ''}>Always drawn
                        </label>
                    </div>
					<div class="points-table-container">
					     ${this.approximation.getTable().outerHTML}
					 </div>`
		}
		return this.message;
	}
}

export class DifferentialFunctionApproximation {
	constructor(approximated, actual, epsilon, points) {
		this.approximated = approximated;
		this.actual = actual;
		this.epsilon = epsilon;
		this.points = points;
	}

	getApproximated() {
		try {
			const node = math.parse(this.approximated.replace("Log", "log"));
			return node.toTex();
		} catch (error) {
			console.error("Error generating LaTeX:", error);
			return "";
		}
	}

	getActual() {
		try {
			const node = math.parse(this.actual.replace("Log", "log"));
			return node.toTex();
		} catch (error) {
			console.error("Error generating LaTeX:", error);
			return "";
		}
	}

	getTable() {
		const table = document.createElement('table');
		table.classList.add('points-table');

		const thead = document.createElement('thead');
		const headerRow = document.createElement('tr');
		headerRow.classList.add('table-header-row');

		const xHeader = document.createElement('th');
		xHeader.textContent = '$$x$$';
		headerRow.appendChild(xHeader);

		const yHeader = document.createElement('th');
		yHeader.textContent = '$$y$$';
		headerRow.appendChild(yHeader);

		thead.appendChild(headerRow);
		table.appendChild(thead);

		const tbody = document.createElement('tbody');

		this.points.forEach(point => {
			const row = document.createElement('tr');
			row.classList.add('table-data-row');

			const xCell = document.createElement('td');
			xCell.textContent = point.x;
			row.appendChild(xCell);

			const yCell = document.createElement('td');
			yCell.textContent = point.y;
			row.appendChild(yCell);

			tbody.appendChild(row);
		});

		table.appendChild(tbody);

		return table;
	}
}
