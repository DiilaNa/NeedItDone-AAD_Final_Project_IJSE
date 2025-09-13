package lk.ijse.project.backend.dto;

import lk.ijse.project.backend.entity.enums.JobPostStatus;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ActiveJobDTO {
    private Long applicationId;
    private Long jobPostId;
    private String jobTitle;
    private String description;
    private JobPostStatus jobPostStatus;
    private Double cost;
    private String deadline;
}

