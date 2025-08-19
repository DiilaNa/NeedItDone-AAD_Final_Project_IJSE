package lk.ijse.project.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Application implements SuperEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String jobTitle;
    private String category;
    private Date date;
    private String status;
    private Double amount;

    @ManyToOne
    @JoinColumn(name = "jobPost_id")
    private JobPost jobPosts;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User users;

}
