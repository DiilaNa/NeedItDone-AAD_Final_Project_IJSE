package lk.ijse.project.backend.controller;

import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import lk.ijse.project.backend.dto.login.LogInDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.service.UserService;
import lk.ijse.project.backend.service.impl.UserServiceImpl;
import lk.ijse.project.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class LoginController {
    private final UserServiceImpl userServiceImpl;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO> registerUser(@RequestBody SignUpDTO signUpDTO) {
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "User Registered Successfully",
                        userServiceImpl.Register(signUpDTO)
                )

        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponseDTO> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body(new ApiResponseDTO(401, "Invalid refresh token", null));
        }

        String username = jwtUtil.extractUserName(refreshToken);
        String newAccessToken = jwtUtil.generateToken(username);

        return ResponseEntity.ok(new ApiResponseDTO(200, "Token refreshed", newAccessToken));
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO> login(@RequestBody LogInDTO loginDTO) {
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "ok",
                        userServiceImpl.authenticate(loginDTO)
                )
        );
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponseDTO> updateUser(@RequestBody SignUpDTO signUpDTO) {
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "User Updated Successfully",
                        userService.updateUser(signUpDTO)
                )
        );
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponseDTO> deleteUser(@RequestBody SignUpDTO signUpDTO) {
        userService.deleteUser(signUpDTO);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "User Deleted",
                        "ok"
                )
        );
    }

    @GetMapping("/get")
    public ResponseEntity<ApiResponseDTO> getAllUsers() {
        List<SignUpDTO> users =  userService.getAllUsers();
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Load All users",
                        users
                )
        );


    }




}
