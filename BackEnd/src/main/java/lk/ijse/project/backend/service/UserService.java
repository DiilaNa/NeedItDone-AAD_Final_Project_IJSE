package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.login.SignUpDTO;
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
}
