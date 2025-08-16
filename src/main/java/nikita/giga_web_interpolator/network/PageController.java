package nikita.giga_web_interpolator.network;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

	@GetMapping("/solver/interpolator")
	public String getInterpolatorPage() {
		return "forward:/page/interpolator.html";
	}

	@GetMapping("/solver/differential")
	public String getDifferentialPage() {
		return "forward:/page/differential.html";
	}
}