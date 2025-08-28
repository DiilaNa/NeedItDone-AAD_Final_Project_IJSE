package lk.ijse.project.backend.dto.login;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SignUpDTO {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String role;
    private LocalDate joinDate;

}
