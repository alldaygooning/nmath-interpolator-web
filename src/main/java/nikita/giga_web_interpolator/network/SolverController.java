package nikita.giga_web_interpolator.network;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.matheclipse.parser.client.SyntaxError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import nikita.giga_web_interpolator.exception.InvalidPointException;
import nikita.giga_web_interpolator.exception.RequestParsingException;
import nikita.giga_web_interpolator.network.request.DifferentialRequest;
import nikita.giga_web_interpolator.network.request.InterpolatorRequest;
import nikita.giga_web_interpolator.network.request.ParsedDifferentialRequest;
import nikita.giga_web_interpolator.network.request.PointRequest;
import nikita.giga_web_interpolator.network.response.DifferentialFunctionApproximationWrapper;
import nikita.giga_web_interpolator.network.response.DifferentialResponse;
import nikita.giga_web_interpolator.network.response.FunctionInterpolationWrapper;
import nikita.giga_web_interpolator.network.response.InterpolatorResponse;
import nikita.giga_web_interpolator.network.response.PointResponse;
import nikita.math.construct.Precision;
import nikita.math.construct.Variable;
import nikita.math.construct.expression.Expression;
import nikita.math.construct.point.Point;
import nikita.math.exception.solver.approximate.DifferentialFunctionApproximationException;
import nikita.math.exception.solver.interpolate.FunctionInterpolationException;
import nikita.math.solver.approximate.differential.DifferentialFunctionApproximation;
import nikita.math.solver.approximate.differential.DifferentialFunctionApproximator;
import nikita.math.solver.interpolate.FunctionInterpolation;
import nikita.math.solver.interpolate.FunctionInterpolationContext;
import nikita.math.solver.interpolate.FunctionInterpolator;

@RestController
public class SolverController {

	@PostMapping("/solver/interpolator/api")
	public ResponseEntity<InterpolatorResponse> interpolator(@RequestBody InterpolatorRequest request) {
		InterpolatorResponse response = new InterpolatorResponse();
		List<Point> points = null;
		String sharedErrorMessage = null;
		try {
			points = request.getParsedPoints();
			if (points.size() == 0) {
				sharedErrorMessage = "No points were provided.";
			}
		} catch (InvalidPointException e) {
			sharedErrorMessage = e.getMessage();
		}

		BigDecimal x = null;
		try {
			x = new BigDecimal(request.getX());
		} catch (NumberFormatException e) {
			sharedErrorMessage = String.format("x (%s) should be a real number", request.getX());
		}

		Precision precision = new Precision("0.000000000000000000001");
		List<FunctionInterpolationWrapper> interpolationWrappers = new ArrayList<FunctionInterpolationWrapper>();
		for (String method : request.getMethods()) {
			FunctionInterpolationWrapper interpolationWrapper = new FunctionInterpolationWrapper();
			interpolationWrappers.add(interpolationWrapper);

			interpolationWrapper.setInterpolatorFullName(FunctionInterpolator.getInterpolator(method).getFullName());
			if (sharedErrorMessage != null) {
				interpolationWrapper.setSuccessful(false);
				interpolationWrapper.setMessage(sharedErrorMessage);
				continue;
			}

			try {
				FunctionInterpolationContext context = new FunctionInterpolationContext(x);
				FunctionInterpolation interpolation = FunctionInterpolator.interpolate(points, precision, method, context);
				interpolationWrapper.setSuccessful(true);
				interpolationWrapper.setInterpolation(interpolation);
			} catch (FunctionInterpolationException e) {
				interpolationWrapper.setSuccessful(false);
				interpolationWrapper.setMessage(e.getMessage());
			} catch (Exception e) {
				interpolationWrapper.setSuccessful(false);
				interpolationWrapper.setMessage(String.format("Unexpected Error occured: %s.", e.getMessage()));
			}
		}

		response.setWrappers(interpolationWrappers);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/solver/interpolator/points")
	public ResponseEntity<PointResponse> generatePoints(@RequestBody PointRequest request) {
		PointResponse response = new PointResponse();
		response.setSuccessful(true);
		Expression expression = new Expression(request.getExpression());

		BigDecimal left, right;
		int n;
		try {
			left = new BigDecimal(request.getLeft());
			right = new BigDecimal(request.getRight());
			if (left.compareTo(right) >= 0) {
				throw new NumberFormatException();
			}
		} catch (NumberFormatException e) {
			response.setSuccessful(false);
			response.setMessage("Left has to be less that right. Left and right endpoints should be valid numbers.");
			return ResponseEntity.ok(response);
		}

		try {
			n = Integer.parseInt(request.getN());
			if (n <= 0) {
				throw new NumberFormatException();
			}
		} catch (NumberFormatException e) {
			response.setSuccessful(false);
			response.setMessage("N should be a natural number");
			return ResponseEntity.ok(response);
		}

		if (!expression.containsSymbol(new Variable("x"))) {
			response.setSuccessful(false);
			response.setMessage("Expression does not contain 'x'");
			return ResponseEntity.ok(response);
		}

		List<Point> points = new ArrayList<Point>();
		try {
			BigDecimal h = right.subtract(left).divide(BigDecimal.valueOf(n));
			BigDecimal current = left;
			for (int i = 0; i < n; i++) {
				current = left.add(h.multiply(BigDecimal.valueOf(i)));
				Point point = new Point(current, expression.evaluateAt(new Variable("x", current)).toBigDecimal());
				points.add(point);
			}
		} catch (SyntaxError e) {
			response.setSuccessful(false);
			response.setMessage("Expression contains syntax error(s): " + e.getMessage());
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.setSuccessful(false);
			response.setMessage("Unexpected error occured: " + e.getMessage());
			return ResponseEntity.ok(response);
		}

		response.setPoints(points);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/solver/differential/api")
	public ResponseEntity<DifferentialResponse> differential(@RequestBody DifferentialRequest req) {
		DifferentialResponse response = new DifferentialResponse();
		List<String> methods = req.getMethods();
		ParsedDifferentialRequest request = null;
		String sharedErrorMessage = null;
		try {
			request = new ParsedDifferentialRequest(req);
		} catch (RequestParsingException e) {
			sharedErrorMessage = e.getMessage();
		}

		List<DifferentialFunctionApproximationWrapper> wrappers = new ArrayList<DifferentialFunctionApproximationWrapper>();
		for (String method : methods) {
			System.out.println("SOLVING VIA " + method);
			DifferentialFunctionApproximationWrapper wrapper = new DifferentialFunctionApproximationWrapper();
			wrappers.add(wrapper);
			DifferentialFunctionApproximator approximator;
			try {
				approximator = DifferentialFunctionApproximator.getDifferentialApproximator(method);
			} catch (DifferentialFunctionApproximationException e) {
				wrapper.setSuccessful(false);
				wrapper.setMessage(e.getMessage());
				continue;
			}
			wrapper.setApproximatorFullName(approximator.getFullName());
			if (sharedErrorMessage != null) {
				wrapper.setSuccessful(false);
				wrapper.setMessage(sharedErrorMessage);
				continue;
			}

			try {
				DifferentialFunctionApproximation approximation = DifferentialFunctionApproximator.dSolve(request.getDifferential(),
						new Point(request.getInterval().getLeft(), request.getY()), request.getInterval(), request.getStep(), method,
						request.getPrecision());
				wrapper.setSuccessful(true);
				wrapper.setApproximation(approximation);
				System.out.println("SOLVED!");
				continue;
			} catch (DifferentialFunctionApproximationException e) {
				wrapper.setSuccessful(false);
				wrapper.setMessage(e.getMessage());
			} catch (Exception e) {
				wrapper.setSuccessful(false);
				wrapper.setMessage(String.format("Unexpected error occured: %s", e.getMessage()));
			}

		}

		response.setWrappers(wrappers);
		return ResponseEntity.ok(response);
	}
}
