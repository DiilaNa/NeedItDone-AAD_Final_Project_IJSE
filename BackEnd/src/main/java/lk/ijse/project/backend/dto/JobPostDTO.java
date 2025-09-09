package lk.ijse.project.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lk.ijse.project.backend.entity.enums.JobPostStatus;
import lk.ijse.project.backend.entity.enums.JobPostVisibility;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobPostDTO {
    private Long id;
    @NotBlank(message = "job title can not be blank")
    private String jobTitle;
    @NotBlank(message = "description can not be blank")
    private String description;
    @NotNull(message = "cost can not be blank")
    private Double cost;
    @NotBlank(message = "location can not be blank")
    private String location;
    @NotBlank(message = "urgency can not be blank")
    private String urgency;
    @NotBlank(message = " deadline can not be blank")
    private String deadline;
    private boolean applied;
    private LocalDate postedDate;
    private String username;
    private JobPostStatus jobPostStatus;
    private JobPostVisibility jobPostVisibility;
    @NotBlank
    private int daysSincePosted;
    private long applicationsCount;
    private String categoryName;
}
