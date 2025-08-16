package nikita.giga_web_interpolator.network.response;

import java.util.List;

public class DifferentialResponse {
	private List<DifferentialFunctionApproximationWrapper> wrappers;

	public List<DifferentialFunctionApproximationWrapper> getWrappers() {
		return wrappers;
	}

	public void setWrappers(List<DifferentialFunctionApproximationWrapper> wrappers) {
		this.wrappers = wrappers;
	}
}
