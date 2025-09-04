package lk.ijse.project.backend.dto;

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
    private Double cost;
    private String deadline;
}

