package lk.ijse.project.backend.dto.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String accessToken;
    private Long userId;       // new
    private String username;   // optional
    private String role;
}
