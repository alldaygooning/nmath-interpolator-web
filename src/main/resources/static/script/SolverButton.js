import { SolutionDisplay, SolutionPage, FunctionInterpolation } from "./solution.js";

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
			try {
				const response = await fetch("http://localhost:8080/solver/interpolator/api", {
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
				this.solutionDisplay.clear();
				for(const wrapper of data.wrappers){
					let page;
					if(wrapper.successful){
						const wi = wrapper.interpolation;
						const functionInterpolation = new FunctionInterpolation(
							wi.interpolated,
							wi.point.x,
							wi.point.y,
							wi.differences
						);
						page = SolutionPage.get(wrapper.successful, wrapper.interpolatorFullName, functionInterpolation);
					}
					else{
						page = SolutionPage.get(wrapper.successful, wrapper.interpolatorFullName, wrapper.message);
					}
					this.solutionDisplay.add(page);
				}
			} catch (error) {
				console.error("Error sending data:", error);
			}
		});
	}
}
