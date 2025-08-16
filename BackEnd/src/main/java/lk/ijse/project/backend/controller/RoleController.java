package lk.ijse.project.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class RoleController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String admin(Authentication authentication) {
        System.out.println("USER : " + authentication.getName());
        return "hello admin";
    }
    @GetMapping("/worker")
    @PreAuthorize("hasRole('WORKERS')")
    public String worker(Authentication authentication) {
        System.out.println("USER : " + authentication.getName());
        return "hello worker";
    }
    @GetMapping("/homeworker")
    @PreAuthorize("hasRole('HOMEWORKERS')")
    public String homeOwner(Authentication authentication) {
        System.out.println("USER : " + authentication.getName());
        return "hello homeworker";
    }

}
