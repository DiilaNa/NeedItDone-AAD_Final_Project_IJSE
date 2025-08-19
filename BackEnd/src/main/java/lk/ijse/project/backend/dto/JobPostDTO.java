package lk.ijse.project.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobPostDTO {
    @NotBlank(message = "job title can not be blank")
    private String jobTitle;
    @NotBlank(message = "cost can not be blank")
    private Double cost;
    @NotBlank(message = "location can not be blank")
    private String location;
    @NotBlank(message = "urgency can not be blank")
    private String urgency;
    @NotBlank(message = " deadline can not be blank")
    private String deadline;
}
