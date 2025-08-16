package nikita.giga_web_interpolator.network.response;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import nikita.math.construct.point.Point;
import nikita.math.solver.interpolate.FunctionInterpolation;

public class FunctionInterpolationSerializer extends StdSerializer<FunctionInterpolation> {
	private static final long serialVersionUID = 1L;

	public FunctionInterpolationSerializer() {
		this(null);
	}

	public FunctionInterpolationSerializer(Class<FunctionInterpolation> t) {
		super(t);
	}

	@Override
	public void serialize(FunctionInterpolation interpolation, JsonGenerator gen, SerializerProvider provider) throws IOException {
		gen.writeStartObject();

		gen.writeStringField("interpolated", interpolation.getInterpolated().toString(interpolation.getPrecision()));

		Point point = interpolation.getPoint();
		gen.writeObjectFieldStart("point");
		gen.writeStringField("x", point.getX().toPlainString());
		gen.writeStringField("y", point.getY().toPlainString());
		gen.writeEndObject();

		Optional<List<List<BigDecimal>>> diffOpt = interpolation.getDifferences();
		if (diffOpt.isPresent()) {
			List<List<BigDecimal>> differences = diffOpt.get();
			gen.writeArrayFieldStart("differences");
			for (List<BigDecimal> row : differences) {
				gen.writeStartArray();
				for (BigDecimal value : row) {
					gen.writeString(value.toPlainString());
				}
				gen.writeEndArray();
			}
			gen.writeEndArray();
		}

		gen.writeEndObject();
	}
}
