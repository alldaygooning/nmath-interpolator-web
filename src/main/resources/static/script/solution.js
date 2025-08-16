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
			this.calculator.set(page.interpolation.getLatex(), this.currentPage);
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
		await safeTypeset();
	}

	move(value) {
		this.calculator.removePoint("current-point");
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
		const interpolation = page.interpolation;
		if(page.successful){
			this.calculator.addPoint(interpolation.x, interpolation.y);
		}
		this.updateGraphDisplay();
	}

	updateCount() {
		this.pageNumber.innerText = `${this.currentPage + 1}/${this.pages.length}`;
	}

	updateGraphDisplay() {
		for (let i = 0; i < this.pages.length; i++) {
			this.calculator.remove(i);
		}

		for (let i = 0; i < this.pages.length; i++) {
			const page = this.pages[i];
			if (page.successful && (page.alwaysDisplay || i === this.currentPage)) {
				this.calculator.set(page.interpolation.getLatex(), i);
				if (i === this.currentPage) {
					this.calculator.select(i);
				} else {
					this.calculator.unselect(i);
				}
			}
		}
	}

	downloadJson() {
		const data = this.pages.map(page => {
			const basicData = {

			};

			if (page.successful && page.interpolation) {
				basicData.interpolation = {

				};
			} else {
				basicData.message = page.message;
			}

			return basicData;
		});

		const jsonStr = JSON.stringify(data, null, 2);

		const blob = new Blob([jsonStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = "solution-data.json";
		document.body.appendChild(a);
		a.click();

		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
}

export class SolutionPage {
	constructor(successful, interpolator) {
		this.successful = successful;
		this.interpolator = interpolator;
		this.interpolation = null;
		this.alwaysDisplay = false;
	}

	static get(successful, interpolator, messageOrInterpolation) {
		const page = new SolutionPage(successful, interpolator);
		if (page.successful) {
			page.interpolation = messageOrInterpolation;
		} else {
			page.message = messageOrInterpolation;
		}
		return page;
	}

	getName() {
		return this.interpolator;
	}

	getElement() {
		if (this.successful) {
			return `<div class="interpolation">Interpolation Polynomial: $${this.interpolation.getLatex()}$</div>
                    <div class="display-toggle">
                        <label>
                            <input type="checkbox" class="always-display-checkbox" ${this.alwaysDisplay ? 'checked' : ''}>Always drawn
                        </label>
                    </div>
					<div class="interpolation-point">(${this.interpolation.x}; ${this.interpolation.y})</div>
                    ${this.interpolation.differences ? this.interpolation.getTable().outerHTML : ""}`;
		}
		return this.message;
	}
}

export class FunctionInterpolation {
	constructor(interpolated, x, y, differences) {
		this.interpolated = interpolated;
		this.x = x;
		this.y = y;
		this.differences = differences;
	}

	getLatex() {
		try {
			const node = math.parse(this.interpolated.replace("Log", "log"));
			return node.toTex();
		} catch (error) {
			console.error("Error generating LaTeX:", error);
			return "";
		}
	}

	getTable() {
		const table = document.createElement("table");
		table.classList.add("finite-difference-table");

		const createCell = (cellType, content) => {
			const cell = document.createElement(cellType);
			cell.innerHTML = `$$ ${content} $$`;
			return cell;
		};

		const headerRow = document.createElement("tr");

		const indexHeader = createCell("th", "i");
		headerRow.appendChild(indexHeader);

		const numCols = this.differences.length;

		const firstHeader = createCell("th", "y(x)");
		headerRow.appendChild(firstHeader);

		for (let col = 1; col < numCols; col++) {
			let headerContent = "";
			if (col === 1) {
				headerContent = "\\Delta y(x)";
			} else {
				headerContent = `\\Delta^{${col}} y(x)`;
			}
			const headerCell = createCell("th", headerContent);
			headerRow.appendChild(headerCell);
		}
		table.appendChild(headerRow);

		const numRows = this.differences[0].length;
		for (let row = 0; row < numRows; row++) {
			const tableRow = document.createElement("tr");

			const indexCell = createCell("td", row.toString());
			tableRow.appendChild(indexCell);

			for (let col = 0; col < numCols; col++) {
				let cellContent = "";
				if (row < this.differences[col].length) {
					let value = this.differences[col][row];
					const num = parseFloat(value);
					if (!isNaN(num)) {
						value = num.toFixed(2);
					}
					cellContent = value;
				}
				const tableCell = createCell("td", cellContent);
				tableRow.appendChild(tableCell);
			}
			table.appendChild(tableRow);
		}
		return table;
	}
}
