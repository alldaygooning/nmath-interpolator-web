package nikita.giga_web_interpolator.network.response;

import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonInclude;

import nikita.math.solver.approximate.differential.DifferentialFunctionApproximation;

@JsonInclude(JsonInclude.Include.NON_ABSENT)
public class DifferentialFunctionApproximationWrapper {

	private boolean successful;
	private Optional<String> message;
	private Optional<String> approximatorFullName;
	private Optional<DifferentialFunctionApproximation> approximation;

	public DifferentialFunctionApproximationWrapper() {
		this.message = Optional.empty();
		this.approximatorFullName = Optional.empty();
		this.approximation = Optional.empty();
	}

	public boolean isSuccessful() {
		return successful;
	}

	public void setSuccessful(boolean successful) {
		this.successful = successful;
	}

	public void setMessage(String message) {
		this.message = Optional.ofNullable(message);
	}

	public Optional<String> getMessage() {
		return message;
	}

	public void setApproximatorFullName(String approximatorFullName) {
		this.approximatorFullName = Optional.ofNullable(approximatorFullName);
	}

	public Optional<String> getApproximatorFullName() {
		return approximatorFullName;
	}

	public void setApproximation(DifferentialFunctionApproximation approximation) {
		this.approximation = Optional.ofNullable(approximation);
	}

	public Optional<DifferentialFunctionApproximation> getApproximation() {
		return approximation;
	}

}
