package lk.ijse.project.backend.dto.login;

import lk.ijse.project.backend.entity.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private Long userId;
    private String username;
    private String role;
    private Status status;
}
