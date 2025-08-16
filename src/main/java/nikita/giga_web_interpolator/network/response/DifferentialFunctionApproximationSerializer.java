package nikita.giga_web_interpolator.network.response;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import nikita.math.construct.point.Point;
import nikita.math.solver.approximate.differential.DifferentialFunctionApproximation;

public class DifferentialFunctionApproximationSerializer extends StdSerializer<DifferentialFunctionApproximation> {

	private static final long serialVersionUID = 1L;

	public DifferentialFunctionApproximationSerializer() {
		this(DifferentialFunctionApproximation.class);
	}

	public DifferentialFunctionApproximationSerializer(Class<DifferentialFunctionApproximation> t) {
		super(t);
	}

	@Override
	public void serialize(DifferentialFunctionApproximation approximation, JsonGenerator gen, SerializerProvider provider)
			throws IOException {
		gen.writeStartObject();

		gen.writeStringField("approximated", approximation.getDifferentialApproximated().toString(approximation.getPrecision()));
		gen.writeStringField("actual", approximation.getActualApproximated().toString(approximation.getPrecision()));
		gen.writeStringField("epsilon", approximation.getEpsilon().toPlainString());

		gen.writeArrayFieldStart("points");
		for (Point point : approximation.getPoints()) {
			gen.writeStartObject();
			gen.writeStringField("x", point.getX().toPlainString());
			gen.writeStringField("y", point.getY().toPlainString());
			gen.writeEndObject();
		}
		gen.writeEndArray();

		gen.writeEndObject();
	}
}