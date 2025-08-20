package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.login.SignUpDTO;

import java.util.List;


public interface UserService {
    String updateUser(SignUpDTO signUpDTO);
    void deleteUser(SignUpDTO signUpDTO);
    String register(SignUpDTO signUpDTO);

    List<SignUpDTO> getAllUsers();
}
