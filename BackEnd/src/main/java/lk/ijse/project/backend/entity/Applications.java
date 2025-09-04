package lk.ijse.project.backend.entity;

import jakarta.persistence.*;
import lk.ijse.project.backend.entity.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Applications implements SuperEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String jobTitle;
    private String category;
    private Date date;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
    private Double amount;

    private String description;
    private String skills;
    private Integer experience;

    @ManyToOne
    @JoinColumn(name = "jobPost_id")
    private JobPosts jobPosts;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User users;

}
