package lk.ijse.project.backend.dto.login;

import lombok.Data;

@Data
public class TokenRefreshRequest {
    private String refreshToken;
}

