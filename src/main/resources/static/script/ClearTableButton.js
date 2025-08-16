export class ClearTableButton{
	constructor(button, table){
		this.button = button;
		this.table = table;
		
		this.#addEventListeners();
	}
	
	#addEventListeners(){
		this.button.addEventListener("click", () => {
			this.table.clear();
		})
	}
}