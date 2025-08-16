package nikita.giga_web_interpolator.network.request;

import java.math.BigDecimal;
import java.util.List;

import nikita.giga_web_interpolator.exception.RequestParsingException;
import nikita.math.construct.Interval;
import nikita.math.construct.Precision;
import nikita.math.construct.expression.Expression;
import nikita.math.exception.construct.interval.IntervalParametersException;

public class ParsedDifferentialRequest {

	List<String> methods;
	Expression differential;
	Interval interval;
	BigDecimal y;
	BigDecimal step;
	Precision precision;

	public ParsedDifferentialRequest(DifferentialRequest request) {
		this.methods = request.getMethods();

		this.differential = new Expression(request.getExpression());
		try {
			this.differential.getEvaluatedExpr();
		} catch (Exception e) {
			throw new RequestParsingException(String.format("Differential Expression contains syntax error(s): %s", e.getMessage()));
		}

		try {
			BigDecimal left = new BigDecimal(request.getLeft());
			BigDecimal right = new BigDecimal(request.getRight());
			this.interval = new Interval(left, right);
		} catch (NumberFormatException e) {
			throw new RequestParsingException(
					String.format("Left and right endpoints should be valid numbers ([%s; %s])", request.getLeft(), request.getRight()));
		} catch (IntervalParametersException e) {
			throw new RequestParsingException(e.getMessage());
		}

		try {
			this.y = new BigDecimal(request.getY());
		} catch (NumberFormatException e) {
			throw new RequestParsingException(String.format("Initial y value should be a valid number (%s)", request.getY()));
		}

		try {
			this.step = new BigDecimal(request.getStep());
		} catch (NumberFormatException e) {
			throw new RequestParsingException(String.format("Step length should be a valid number (%s)", request.getStep()));
		}

		try {
			BigDecimal accuracy = new BigDecimal(request.getPrecision());
			this.precision = new Precision(accuracy.toPlainString());
		} catch (NumberFormatException e) {
			throw new RequestParsingException(String.format("Precision should be a valid number (%s)", request.getPrecision()));
		}
	}

	public List<String> getMethods() {
		return methods;
	}

	public Expression getDifferential() {
		return differential;
	}

	public Interval getInterval() {
		return interval;
	}

	public BigDecimal getY() {
		return y;
	}

	public BigDecimal getStep() {
		return step;
	}

	public Precision getPrecision() {
		return precision;
	}

}
