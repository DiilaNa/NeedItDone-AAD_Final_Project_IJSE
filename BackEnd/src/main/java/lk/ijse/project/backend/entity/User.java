package lk.ijse.project.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lk.ijse.project.backend.entity.enums.Role;
import lk.ijse.project.backend.entity.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder/*Helps to create objects without using the new keyword*/
public class User implements SuperEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String email;
    private String phone;
    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(updatable = false)
    private LocalDate joinDate;

    @PrePersist
    protected void onCreate() {
        this.joinDate = LocalDate.now();
    }

    @OneToMany(mappedBy = "users")
    @JsonIgnore
    private List<JobPosts> jobPosts; /*JobPost One to Many*/

    @OneToOne(mappedBy = "users")
    private Rating ratings;  /*Rating one to one*/

    @OneToMany(mappedBy = "users")
    @JsonIgnore
    private List<Applications> applications;
}
