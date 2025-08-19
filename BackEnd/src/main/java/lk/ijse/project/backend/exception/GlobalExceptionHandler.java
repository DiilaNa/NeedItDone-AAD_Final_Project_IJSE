package lk.ijse.project.backend.exception;

import io.jsonwebtoken.ExpiredJwtException;
import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponseDTO handleUserNameNotFoundException(UsernameNotFoundException e) {
        return new ApiResponseDTO(404, "User not found", null);
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponseDTO handleBadCredentialsException(BadCredentialsException e) {
        return new ApiResponseDTO(400, "Bad credentials", null);
    }

    //    handle JWT token expire errors
    @ExceptionHandler(ExpiredJwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponseDTO handleJWTTokenExpireException(Exception e) {
        return new ApiResponseDTO(401, "JWT token expired", null);
    }

    //    handle all exceptions
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponseDTO handleAllException(RuntimeException e) {
        return new ApiResponseDTO(500, "Internal Server Error", e.getMessage());
    }
}