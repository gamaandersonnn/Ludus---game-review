package ludus.back_end.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewPostRequestBody {

    @NotBlank
    private String name;

    @Min(1)
    @Max(5)
    private int rating;

    private String comment;

    private String backgroundImg;
}
