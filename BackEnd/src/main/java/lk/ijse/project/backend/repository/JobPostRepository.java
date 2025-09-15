package lk.ijse.project.backend.repository;

import lk.ijse.project.backend.entity.JobPosts;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.entity.enums.JobPostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostRepository extends JpaRepository<JobPosts,Integer> {
    List<JobPosts> findJobPostsByJobTitleContainingIgnoreCase(String jobTitle);

    Optional<Object> findById(Long jobPostsId);

    @Query("SELECT COUNT(a) FROM Applications a WHERE a.jobPosts.id = :jobId")
    long countApplicationsByJobId(Long jobId);

    void deleteById(Long id);

    List<JobPosts> findDistinctTop10ByOrderByPostedDateDesc();

    List<JobPosts> findByUsers(User user);

//    @Query("SELECT j FROM JobPosts j " +
//            "WHERE (:keyword IS NULL OR j.jobTitle LIKE %:keyword% OR j.description LIKE %:keyword%)")
//    List<JobPosts> searchJobs(@Param("keyword") String keyword);
@Query("SELECT j FROM JobPosts j " +
        "WHERE (:keyword IS NULL OR j.jobTitle LIKE %:keyword% OR j.description LIKE %:keyword%) " +
        "AND (:location IS NULL OR j.location LIKE %:location%)")
List<JobPosts> searchJobs(@Param("keyword") String keyword, @Param("location") String location);


    List<JobPosts> findByJobTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String title, String description, String location
    );

    List<JobPosts> findTop3ByUsers_IdOrderByPostedDateDesc(Long userId);

    long countByUsers_Id(Long userId);

    long countByUsers_IdAndJobPostStatus(Long userId, JobPostStatus jobPostStatus);

    Object countByJobPostStatus(JobPostStatus status);
}
