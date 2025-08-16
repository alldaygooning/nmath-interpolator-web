package nikita.giga_web_interpolator.network.response;

import java.util.List;

import nikita.math.construct.point.Point;

public class PointResponse {
    private boolean successful;
    private String message;
    private List<Point> points;
    
    public boolean isSuccessful() {
        return successful;
    }
    
    public void setSuccessful(boolean successful) {
        this.successful = successful;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public List<Point> getPoints() {
        return points;
    }
    
    public void setPoints(List<Point> points) {
        this.points = points;
    }
}