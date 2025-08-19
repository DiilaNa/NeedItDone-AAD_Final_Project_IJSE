package lk.ijse.project.backend.dto.login;
import lombok.Data;

@Data
public class SignUpDTO {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String role;

}
