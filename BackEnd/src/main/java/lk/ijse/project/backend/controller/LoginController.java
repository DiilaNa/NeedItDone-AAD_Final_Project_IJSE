package lk.ijse.project.backend.controller;

import jdk.dynalink.linker.LinkerServices;
import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import lk.ijse.project.backend.dto.login.LogInDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.service.UserService;
import lk.ijse.project.backend.service.impl.UserServiceImpl;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class LoginController {
    private final UserServiceImpl userServiceImpl;
    private final UserService userService;

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
