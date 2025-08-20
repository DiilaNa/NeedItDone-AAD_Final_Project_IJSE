package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.login.LogInDTO;
import lk.ijse.project.backend.dto.login.LoginResponseDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.entity.Role;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.repository.UserRepository;
import lk.ijse.project.backend.service.UserService;
import lk.ijse.project.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ModelMapper modelMapper;

    public String Register(SignUpDTO signUpDTO) {
        if (userRepository.findByUsername(signUpDTO.getUsername()).isPresent()){
            throw new RuntimeException("Username is already Exists");

        }
        User user = User.builder()
                .username(signUpDTO.getUsername())
                .password(passwordEncoder.encode(signUpDTO.getPassword()))
                .email(signUpDTO.getEmail())
                .phone(signUpDTO.getPhone())
                .role(Role.valueOf(signUpDTO.getRole()))
                .build();
        userRepository.save(user);
        return "User Registered Successfully";
    }

    public LoginResponseDTO authenticate(LogInDTO logInDTO) {
        User user = userRepository.findByUsername(logInDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("User Name not Found"));

        if (!passwordEncoder.matches(logInDTO.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid Credentials");
        }
        String token  = jwtUtil.generateToken(logInDTO.getUsername());
        return new LoginResponseDTO(token);
    }


    @Override
    public String updateUser(SignUpDTO signUpDTO) {
        userRepository.save(modelMapper.map(signUpDTO, User.class));
        return "User Updated Successfully";
    }

    @Override
    public void deleteUser(SignUpDTO signUpDTO) {
        userRepository.delete(modelMapper.map(signUpDTO, User.class));
    }

    @Override
    public List<SignUpDTO> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        if (allUsers.isEmpty()){
            throw new RuntimeException("Users Not Found");
        }

        return modelMapper.map(allUsers, new TypeToken<List<SignUpDTO>>(){}.getType());
    }

    @Override
    public List<SignUpDTO> getAllUsersByKeyword(String keyword) {
        List<User> list = userRepository.findByUsernameContainingIgnoreCase(keyword);
        if (list.isEmpty()){
            throw new RuntimeException("Users Not Found");
        }
        return modelMapper.map(list, new TypeToken<List<SignUpDTO>>(){}.getType());
    }
}
