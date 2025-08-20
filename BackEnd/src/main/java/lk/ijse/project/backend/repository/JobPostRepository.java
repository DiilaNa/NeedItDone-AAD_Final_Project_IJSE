package lk.ijse.project.backend.repository;

import lk.ijse.project.backend.entity.JobPosts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPosts,Integer> {
    List<JobPosts> findJobPostsByJobTitleContainingIgnoreCase(String jobTitle);
}
