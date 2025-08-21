package lk.ijse.project.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RatingDTO {
    private Long id;
    @NotBlank(message = "name can not be blank")
    private String name;
    @NotBlank(message = "message can not be blank")
    private int stars;
    @NotBlank(message = "desc can not be blank")
    private String description;
    @NotBlank(message = "date can not be blank")
    private Date date;

    @NotNull(message = "userId can not be null")
    private Long userId;

    @NotNull(message = "jobPostId can not be null")
    private Long jobPostId;

}
