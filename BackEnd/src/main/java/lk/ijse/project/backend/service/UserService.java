package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.entity.User;

public interface UserService {
    String updateUser(SignUpDTO signUpDTO);
    void deleteUser(SignUpDTO signUpDTO);
    String register(SignUpDTO signUpDTO);
}
