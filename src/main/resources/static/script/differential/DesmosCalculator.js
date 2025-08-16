export class DesmosCalculator {
	constructor(container) {
		this.container = container;
		this.options = {
			expressions: false,
			settingsMenu: false,
			lockViewport: false,
			zoomButtons: true
		};

		this.calculator = Desmos.GraphingCalculator(this.container, this.options);
	}

	set(latex, id) {
		const expression = { latex };
		expression.id = id;
		expression.color = "#FF0000";

		this.calculator.setExpression(expression);
	}

	remove(id) {
		const expression = {};
		expression.id = id;

		this.calculator.removeExpression(expression);
	}

	select(id) {
		const update = {
			id,
			color: "#00FF00" // green
		};

		this.calculator.setExpression(update);
	}

	unselect(id) {
		const update = {
			id,
			color: "#FF0000" // red
		};

		this.calculator.setExpression(update);
	}

	addPoint(x, y, id) {
		const latex = `(${x}, ${y})`;
		const expression = {
			id,
			latex,
			color: "#0000FF"
		};

		this.calculator.setExpression(expression);
	}

	removePoint(id) {
		this.calculator.removeExpression({ id });
	}

	addPoints(points, idPrefix) {
		points.forEach((point, index) => {
			this.addPoint(point.x, point.y, `${idPrefix}-point-${index}`);
		});
	}

	removePoints(idPrefix) {
		const expressions = this.calculator.getExpressions();
		expressions.forEach(expr => {
			if (expr.id && expr.id.startsWith(`${idPrefix}-point`)) {
				this.calculator.removeExpression({ id: expr.id });
			}
		});
	}
}