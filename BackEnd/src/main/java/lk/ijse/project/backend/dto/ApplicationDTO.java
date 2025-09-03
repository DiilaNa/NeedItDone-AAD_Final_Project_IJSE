package lk.ijse.project.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lk.ijse.project.backend.entity.enums.ApplicationStatus;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationDTO {
    private Long id;
    @NotBlank(message = "job title can not be blank")
    private String jobTitle;
    @NotBlank(message = "category can not be blank")
    private String category;
    @NotBlank(message = "date can not be blank")
    private Date date;
    @NotBlank(message = "amount can not be blank")
    private Double amount;

    private ApplicationStatus status;
    private String description;
    private String skills;
    private Integer experience;
    private String workerName;
    private Long jobPostsId;
    private Long userId;
}
