package nikita.giga_web_interpolator.exception;

public class RequestParsingException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public RequestParsingException(String reason) {
		super(String.format("Failed to parse request due to: %s.", reason));
	}
}
