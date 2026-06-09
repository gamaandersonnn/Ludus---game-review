package ludus.back_end.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ludus.back_end.enums.GameStatus;

@Data
public class ReviewPutRequestBody {

    @NotBlank
    private String name;

    @Min(1)
    @Max(5)
    private int rating;

    private String comment;

    private String backgroundImg;

    private boolean favorite;

    @NotNull
    private GameStatus status;
}
