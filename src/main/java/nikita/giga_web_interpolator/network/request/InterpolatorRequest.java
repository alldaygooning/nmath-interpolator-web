package nikita.giga_web_interpolator.network.request;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import nikita.giga_web_interpolator.exception.InvalidPointException;
import nikita.math.construct.point.Point;

@JsonIgnoreProperties(ignoreUnknown = true)
public class InterpolatorRequest {
	private List<String> methods;
	private List<PointStringWrapper> points;
	private String x;

	public List<String> getMethods() {
		return methods;
	}

	public void setMethods(List<String> methods) {
		this.methods = methods;
	}

	public List<PointStringWrapper> getPoints() {
		return points;
	}

	public void setPoints(List<PointStringWrapper> points) {
		this.points = points;
	}

	public List<Point> getParsedPoints() {
		List<Point> parsedPoints = new ArrayList<Point>();
		for (PointStringWrapper point : points) {
			String xWrapper = point.getX();
			String yWrapper = point.getY();
			try {
				BigDecimal x = new BigDecimal(xWrapper);
				BigDecimal y = new BigDecimal(yWrapper);
				parsedPoints.add(new Point(x, y));
			} catch (NumberFormatException e) {
				throw new InvalidPointException(
						String.format("Point (%s; %s) should have exact numeric (real) coordinates.", xWrapper, yWrapper));
			}
		}
		return parsedPoints;
	}

	public String getX() {
		return x;
	}

	public void setX(String x) {
		this.x = x;
	}

	public static class PointStringWrapper {
		private String x;
		private String y;

		public String getX() {
			return x;
		}

		public void setX(String x) {
			this.x = x;
		}

		public String getY() {
			return y;
		}

		public void setY(String y) {
			this.y = y;
		}
	}
}
