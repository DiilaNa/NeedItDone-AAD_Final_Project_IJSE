package lk.ijse.project.backend.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import lk.ijse.project.backend.dto.login.LogInDTO;
import lk.ijse.project.backend.dto.login.LoginResponseDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.entity.enums.Role;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.entity.enums.Status;
import lk.ijse.project.backend.repository.UserRepository;
import lk.ijse.project.backend.service.EmailService;
import lk.ijse.project.backend.service.UserService;
import lk.ijse.project.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ModelMapper modelMapper;
    private final EmailService emailService;

    @Override
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
                .status(Status.ACTIVE)
                .build();
        userRepository.save(user);
        return "User Registered Successfully";
    }
    @Override
    public LoginResponseDTO authenticate(LogInDTO logInDTO) {
        User user = userRepository.findByUsername(logInDTO.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User Name not Found"));

        if (!passwordEncoder.matches(logInDTO.getPassword(), user.getPassword())){
            throw new BadCredentialsException("Invalid Credentials");
        }
        String token  = jwtUtil.generateToken(logInDTO.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(logInDTO.getUsername());

        return new LoginResponseDTO(
                token,
                refreshToken,
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                user.getStatus()
        );
    }

   /* @Override
    public String verifyGoogleToken(String idToken) {
        JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), jsonFactory)
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();

        try {
            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken != null) {
                String email = googleIdToken.getPayload().getEmail();
                String name = (String) googleIdToken.getPayload().get("name");

                // Check if user already exists
                User user = (User) userRepository.findByEmail(email)
                        .orElseGet(() -> {
                            // If not exists → sign up (new user)
                            User newUser = new User();
                            newUser.setEmail(email);
                            newUser.setUsername(name);
                            newUser.setPassword("GOOGLE_USER"); // or leave null if not needed
                            return userRepository.save(newUser);
                        });

                // Generate JWT for login
                return jwtUtil.generateToken(user.getEmail());
            } else {
                throw new RuntimeException("Invalid ID token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Token verification failed: " + e.getMessage(), e);
        }
    }*/
   @Override
   public User verifyGoogleToken(String idToken) {
       JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
       GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), jsonFactory)
               .setAudience(Collections.singletonList(CLIENT_ID))
               .build();

       try {
           GoogleIdToken googleIdToken = verifier.verify(idToken);
           if (googleIdToken != null) {
               String email = googleIdToken.getPayload().getEmail();
               String name = (String) googleIdToken.getPayload().get("name");

               User user = (User) userRepository.findByEmail(email)
                       .orElseGet(() -> {

                           User newUser = User.builder()
                                   .email(email)
                                   .username(name)
                                   .password("GOOGLE_USER")
                                   .status(Status.ACTIVE)
                                   .build();

                           return userRepository.save(newUser);
                       });

               return user; // return full user object
           } else {
               throw new RuntimeException("Invalid ID token");
           }
       } catch (Exception e) {
           throw new RuntimeException("Token verification failed: " + e.getMessage(), e);
       }
   }

    @Override
    public void googleLogin(Long userId, String role) {
        User user = (User) userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.valueOf(role));
        userRepository.save(user);
    }

    @Override
    public Status checkUserStatus(String name) {
        return userRepository.findByUsername(name)
                .map(User::getStatus)
                .orElseThrow(() -> new RuntimeException("User not found"));

    }


    private static final String CLIENT_ID = "188745450878-mft7eiau74ispdrf3l78ndhn74acrtoq.apps.googleusercontent.com";



    @Override
    public String updateUser(SignUpDTO signUpDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setUsername(signUpDTO.getUsername());
        existingUser.setEmail(signUpDTO.getEmail());
        existingUser.setPhone(signUpDTO.getPhone());

        userRepository.save(existingUser);
        return jwtUtil.generateToken(existingUser.getUsername());

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
        List<User> list = userRepository
                .findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        keyword, keyword
                );

        if (list.isEmpty()) {
            throw new RuntimeException("Users Not Found");
        }
        return modelMapper.map(list, new TypeToken<List<SignUpDTO>>(){}.getType());
    }

    @Override
    public SignUpDTO findByUserName(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        return modelMapper.map(user, SignUpDTO.class);
    }

    @Override
    public void disableUser(Long id) {
        User user = (User) userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == Status.ACTIVE){
            user.setStatus(Status.BANNED);
        }else {
            user.setStatus(Status.ACTIVE);
        }
        userRepository.save(user);
        sendMail(user);


    }

    @Async
    public void sendMail(User user) {
        String subject;
        String body;

        if (user.getStatus() == Status.BANNED) {
            subject = "Account Suspended - Access Restricted";
            body = "Hi " + user.getUsername() + ",\n\n" +
                    "Your account has been *banned* by the administrator due to policy violations or suspicious activities.\n" +
                    "You will not be able to log in until further notice.\n\n" +
                    "If you believe this is a mistake, please contact support.";
        } else {
            subject = "Account Reactivated - Welcome Back!";
            body = "Hi " + user.getUsername() + ",\n\n" +
                    "Good news! Your account has been *re-activated* by the administrator.\n" +
                    "You can now log in and continue using our platform.\n\n" +
                    "Thank you for being with us!";
        }

        emailService.sendEmail(user.getEmail(), subject, body);

    }
    @Override
    public Object countAllUsers() {
        return userRepository.count();
    }

    @Override
    public Page<SignUpDTO> getAllUsersPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<User> userPage = userRepository.findAll(pageable);

        return userPage.map(user -> {
            SignUpDTO dto = modelMapper.map(user, SignUpDTO.class);
            dto.setJoinDate(user.getJoinDate());
            dto.setStatus(user.getStatus());
            return dto;
        });
    }
}
