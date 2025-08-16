package nikita.giga_web_interpolator.network.response;

import java.util.List;

public class InterpolatorResponse {
	private List<FunctionInterpolationWrapper> wrappers;

	public List<FunctionInterpolationWrapper> getWrappers() {
		return wrappers;
	}

	public void setWrappers(List<FunctionInterpolationWrapper> wrappers) {
		this.wrappers = wrappers;
	}
}
