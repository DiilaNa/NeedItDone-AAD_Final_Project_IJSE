package lk.ijse.project.backend.dto.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponseDTO {
    private int status;
    private String message;
    private Object data;
}
