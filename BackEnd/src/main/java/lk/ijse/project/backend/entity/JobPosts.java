package lk.ijse.project.backend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lk.ijse.project.backend.entity.enums.JobPostStatus;
import lk.ijse.project.backend.entity.enums.JobPostVisibility;
import lk.ijse.project.backend.entity.enums.Status;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class JobPosts implements SuperEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String jobTitle;
    private String description;
    private Double cost;
    private String location;
    private String urgency;
    private String deadline;

    private LocalDate postedDate;

    @Enumerated(EnumType.STRING)
    private JobPostStatus jobPostStatus;

    @Enumerated(EnumType.STRING)
    private JobPostVisibility jobPostVisibility;

    @ManyToOne
    @JoinColumn(name = "userID") /*User One to Many*/
    private User users;

    @OneToMany(mappedBy = "jobPosts")
    @JsonIgnore
    private List<Rating> ratings; /*Rating One to many*/

    @ManyToOne
    @JoinColumn(name = "categoryID")
    private Categories categories;

    @OneToMany(mappedBy = "jobPosts",fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Applications> applications;

}
