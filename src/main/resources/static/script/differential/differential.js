import { Form } from "./Form.js";
import { ExportFormButton } from "./ExportFormButton.js";
import { ImportFormButton } from "./ImportFormButton.js";
import { SolveButton } from "./SolverButton.js"
import { DesmosCalculator } from "./DesmosCalculator.js";


document.addEventListener("DOMContentLoaded", init());

function init() {
	
	const calculator = new DesmosCalculator(document.getElementById("desmos-container"));
	
	const form = new Form();
	const exportFormButton = new ExportFormButton(document.getElementById("export-form-button"), form);
	const importFormButton = new ImportFormButton(document.getElementById("import-form-button"), form);
	const solveButton = new SolveButton(document.getElementById("solve-button"), form, calculator);
}