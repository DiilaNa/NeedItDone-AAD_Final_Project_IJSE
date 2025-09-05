package lk.ijse.project.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Rating implements SuperEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int stars;
    private String description;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "userID")  /*User One to One*/
    private User users;

    @ManyToOne
    @JoinColumn(name = "jobPostID")/*JobPost  one to Many*/
    private JobPosts jobPosts;
}
