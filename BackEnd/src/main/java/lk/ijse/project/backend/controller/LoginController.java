package lk.ijse.project.backend.controller;

import jakarta.validation.Payload;
import lk.ijse.project.backend.dto.login.*;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.service.UserService;
import lk.ijse.project.backend.service.impl.UserServiceImpl;
import lk.ijse.project.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class LoginController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

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

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@RequestBody TokenRefreshRequest request) {
        String refreshToken = request.getRefreshToken();
        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String username = jwtUtil.extractUserName(refreshToken);
        String newAccessToken = jwtUtil.generateToken(username);

        return ResponseEntity.ok(new TokenRefreshResponse(newAccessToken, refreshToken));
    }

    @PostMapping("/google-login")
    public Map<String, Object> googleLogin(@RequestBody Map<String, String> request) {
        String idToken = request.get("token");
        User user = userService.verifyGoogleToken(idToken);

        String jwt = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("role", user.getRole()); // may be null if not assigned
        response.put("userId", user.getId());

        return response;
    }
    @PostMapping("/user/assign-role")
    public ResponseEntity<ApiResponseDTO> assignRole(@RequestBody Map<String, String> body) {
        Long userId = Long.parseLong(body.get("userId"));
        String role = body.get("role");

        userService.googleLogin(userId,role);

        return ResponseEntity.ok(new ApiResponseDTO(
                200,
                "message", "Role assigned successfully"));

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
        List<SignUpDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Load All users",
                        users
                )
        );


    }






}
