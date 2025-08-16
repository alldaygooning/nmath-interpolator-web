import { NumberSpinbox, isNumberKey } from "./NumberSpinbox.js"
import { PointTable } from "./PointTable.js"
import { ClearTableButton } from "./ClearTableButton.js";
import { FillTableButton } from "./FillTableButton.js";
import { Form } from "./Form.js";
import { ExportFormButton } from "./ExportFormButton.js";
import { ImportFormButton } from "./ImportFormButton.js";
import { SolveButton } from "./SolverButton.js"
import { DesmosCalculator } from "./DesmosCalculator.js";


document.addEventListener("DOMContentLoaded", init());

function init() {
	window.isNumberKey = isNumberKey;
	
	const calculator = new DesmosCalculator(document.getElementById("desmos-container"));
	const pointTable = new PointTable(document.getElementById("point-table"), calculator);
	const numberSpinbox = new NumberSpinbox(document.getElementById("number-spinbox-input"), pointTable, 10);
	const clearTableButton = new ClearTableButton(document.getElementById("clear-table-button"), pointTable);
	const fillTableButton = new FillTableButton(document.getElementById("fill-table-button"), pointTable);


	const form = new Form(pointTable, Array.from(document.querySelectorAll('.method-checkbox')), document.getElementById("x-input-field"));
	const exportFormButton = new ExportFormButton(document.getElementById("export-form-button"), form);
	const importFormButton = new ImportFormButton(document.getElementById("import-form-button"), form);
	const solveButton = new SolveButton(document.getElementById("solve-button"), form, calculator);
}