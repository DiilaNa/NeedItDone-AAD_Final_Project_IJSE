package lk.ijse.project.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationDTO {
    @NotBlank(message = "can not be blank")
    private String jobTitle;
    @NotBlank(message = "can not be blank")
    private String category;
    @NotBlank(message = "can not be blank")
    private Date date;
    @NotBlank(message = "can not be blank")
    private String status;
    @NotBlank(message = "can not be blank")
    private Double amount;
}
