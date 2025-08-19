package lk.ijse.project.backend.dto;

import jakarta.validation.constraints.NotBlank;
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
    @NotBlank(message = "name can not be blank")
    private String name;
    @NotBlank(message = "message can not be blank")
    private int stars;
    @NotBlank(message = "desc can not be blank")
    private String description;
    @NotBlank(message = "date can not be blank")
    private Date date;
}
