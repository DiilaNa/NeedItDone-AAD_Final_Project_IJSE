package lk.ijse.project.backend.entity;


import jakarta.persistence.*;
import lombok.*;

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
    private Double cost;
    private String location;
    private String urgency;
    private String deadline;

    @ManyToOne
    @JoinColumn(name = "userID") /*User One to Many*/
    private User users;

    @OneToMany(mappedBy = "jobPosts")
    private List<Rating> ratings; /*Rating One to many*/

    @ManyToOne
    @JoinColumn(name = "categoryID")
    private Categories categories;

    @OneToMany(mappedBy = "jobPosts")
    private List<Applications> applications;

}
