package nikita.giga_web_interpolator.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.module.SimpleModule;

import nikita.giga_web_interpolator.network.response.DifferentialFunctionApproximationSerializer;
import nikita.giga_web_interpolator.network.response.FunctionInterpolationSerializer;
import nikita.math.solver.approximate.differential.DifferentialFunctionApproximation;
import nikita.math.solver.interpolate.FunctionInterpolation;

@Configuration
public class JacksonConfig {

	@Bean
	public Module customSerializersModule() {
		SimpleModule module = new SimpleModule("CustomSerializersModule");

		module.addSerializer(FunctionInterpolation.class, new FunctionInterpolationSerializer());
		module.addSerializer(DifferentialFunctionApproximation.class, new DifferentialFunctionApproximationSerializer());

		return module;
	}
}