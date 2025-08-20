package lk.ijse.project.backend.dto;

import jakarta.validation.constraints.NotBlank;
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
    @NotBlank(message = "status can not be blank")
    private String status;
    @NotBlank(message = "amount can not be blank")
    private Double amount;

    private Long jobPostsId;   // <-- do you have this?
    private Long userId;
}
