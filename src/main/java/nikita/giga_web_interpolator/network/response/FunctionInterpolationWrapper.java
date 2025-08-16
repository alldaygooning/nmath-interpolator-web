package nikita.giga_web_interpolator.network.response;

import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonInclude;

import nikita.math.solver.interpolate.FunctionInterpolation;

@JsonInclude(JsonInclude.Include.NON_ABSENT)
public class FunctionInterpolationWrapper {
	private boolean successful;
	private Optional<String> message;
	private Optional<String> interpolatorFullName;
	private Optional<FunctionInterpolation> interpolation;

	public FunctionInterpolationWrapper() {
		this.message = Optional.empty();
		this.interpolatorFullName = Optional.empty();
		this.interpolation = Optional.empty();
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

	public void setInterpolatorFullName(String interpolatorFullName) {
		this.interpolatorFullName = Optional.ofNullable(interpolatorFullName);
	}

	public Optional<String> getInterpolatorFullName() {
		return interpolatorFullName;
	}

	public void setInterpolation(FunctionInterpolation interpolation) {
		this.interpolation = Optional.ofNullable(interpolation);
	}

	public Optional<FunctionInterpolation> getInterpolation() {
		return interpolation;
	}
}
