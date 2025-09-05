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

    @NotBlank(message = "name cannot be blank")
    private String name;

    @NotNull(message = "stars cannot be null")
    private Integer stars;

    @NotBlank(message = "description cannot be blank")
    private String description;

    @NotNull(message = "date cannot be null")
    private Date date;

    @NotNull(message = "userId cannot be null")
    private Long userId;

    @NotNull(message = "jobPostId cannot be null")
    private Long jobPostId;
}

