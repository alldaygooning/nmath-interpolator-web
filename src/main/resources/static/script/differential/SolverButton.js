import { SolutionDisplay, SolutionPage, DifferentialFunctionApproximation } from "./solution.js";

export class SolveButton {
	constructor(button, form, calculator) {
		this.button = button;
		this.form = form;
		this.calculator = calculator;
		this.solutionDisplay = new SolutionDisplay(document.getElementById("solution-display"), calculator);
		this.#addEventListeners();
	}

	#addEventListeners() {
		this.button.addEventListener('click', async (event) => {
			const formData = this.form.getJsonData();
			console.log(JSON.stringify(formData));
			try {
				const response = await fetch("http://localhost:8080/solver/differential/api", {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(formData)
				});

				if (!response.ok) {
					throw new Error(`Server error: ${response.status}`);
				}

				const data = await response.json();
				console.log(data);
				this.solutionDisplay.clear();
				for (const wrapper of data.wrappers) {
					let page;
					if (wrapper.successful) {
						const wa = wrapper.approximation;
						const functionApproximation = new DifferentialFunctionApproximation(
							wa.approximated, //
							wa.actual, //
							wa.epsilon, //
							wa.points
						)
						page = SolutionPage.get(wrapper.successful, wrapper.approximatorFullName, functionApproximation);
					}
					else {
						page = SolutionPage.get(wrapper.successful, wrapper.approximatorFullName, wrapper.message);
					}
					this.solutionDisplay.add(page);
				}

			} catch (error) {
				console.error("Error sending data:", error);
			}
		});
	}
}
