package lk.ijse.project.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder/*Helps to create objects without using the new keyword*/
public class User implements SuperEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String email;
    private String phone;
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "users")
    private List<JobPost> jobPosts; /*JobPost One to Many*/

    @OneToOne(mappedBy = "users")
    private Rating ratings;  /*Rating one to one*/

    @OneToMany(mappedBy = "users")
    private List<Application> applications;
}
