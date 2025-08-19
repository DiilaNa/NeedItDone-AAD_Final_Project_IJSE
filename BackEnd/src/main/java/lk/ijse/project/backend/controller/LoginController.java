package lk.ijse.project.backend.controller;

import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import lk.ijse.project.backend.dto.login.LogInDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class LoginController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO> registerUser(@RequestBody SignUpDTO signUpDTO) {
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "User Registered Successfully",
                        userService.Register(signUpDTO)
                )

        );
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO> login(@RequestBody LogInDTO loginDTO) {
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "ok",
                        userService.authenticate(loginDTO)
                )
        );
    }
}
