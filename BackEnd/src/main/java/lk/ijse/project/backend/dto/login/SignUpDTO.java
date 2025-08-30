package lk.ijse.project.backend.dto.login;
import lk.ijse.project.backend.entity.enums.Status;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SignUpDTO {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String role;
    private LocalDate joinDate;
    private Status status;

}
