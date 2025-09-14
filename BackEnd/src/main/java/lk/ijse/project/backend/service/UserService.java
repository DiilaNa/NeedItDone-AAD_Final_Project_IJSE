package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.login.LogInDTO;
import lk.ijse.project.backend.dto.login.LoginResponseDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.entity.enums.Status;
import org.springframework.data.domain.Page;

import java.util.List;


public interface UserService {
    String updateUser(SignUpDTO signUpDTO);
    void deleteUser(SignUpDTO signUpDTO);
    List<SignUpDTO> getAllUsers();
    List<SignUpDTO> getAllUsersByKeyword(String keyword);
    Page<SignUpDTO> getAllUsersPaginated(int page, int size);

    SignUpDTO findByUserName(String username);

    void disableUser(Long id);

    Object countAllUsers();

    String Register(SignUpDTO signUpDTO);

    LoginResponseDTO authenticate(LogInDTO loginDTO);

    User verifyGoogleToken(String idToken);

    void googleLogin(Long userId, String role);

    Status checkUserStatus(String name);
}
