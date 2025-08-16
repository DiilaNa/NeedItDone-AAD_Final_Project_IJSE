package lk.ijse.project.backend.controller;

import lk.ijse.project.backend.dto.ApiResponseDTO;
import lk.ijse.project.backend.dto.LogInDTO;
import lk.ijse.project.backend.dto.SignUpDTO;
import lk.ijse.project.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class LoginController {
    private final UserService userService;

    @GetMapping("/register")
    public ResponseEntity<ApiResponseDTO> registerUser(@RequestBody SignUpDTO signUpDTO) {
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "User Registered Successfully",
                        userService.Register(signUpDTO)
                )

        );
    }
    @GetMapping("/login")
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
