package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.login.LogInDTO;
import lk.ijse.project.backend.dto.login.LoginResponseDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.entity.Role;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.repository.UserRepository;
import lk.ijse.project.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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
}
