package lk.ijse.project.backend.repository;

import lk.ijse.project.backend.entity.Applications;
import lk.ijse.project.backend.entity.enums.ApplicationStatus;
import lk.ijse.project.backend.entity.enums.JobPostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ApplicationRepository extends JpaRepository<Applications,Integer> {

    Optional<Object> findById(Long id);

    boolean existsByUsersIdAndJobPostsId(Long userId, Long jobPostId);

    List<Applications> findByUsersId(Long userID);

    boolean existsByUsers_IdAndJobPosts_Id(Long userId, Long jobPostId);

    @Query("SELECT a FROM Applications a WHERE a.jobPosts.users.id = :homeownerId")
    List<Applications> findAllApplicationsForHomeowner(@Param("homeownerId") Long homeownerId);

    List<Applications> findByUsersIdAndStatus(Long workerId, ApplicationStatus status);

    Optional<Applications> findByIdAndUsers_Id(Long id, Long userId);

    List<Applications> findTop3ByJobPosts_Users_IdOrderByDateDesc(Long homeownerId);

    long countByJobPosts_Users_Id(Long userId);

    long countByUsers_Id(Long workerId);

    @Query("SELECT COUNT(a) " +
            "FROM Applications a " +
            "WHERE a.users.id = :userId " +
            "AND a.status = :applicationStatus " +
            "AND a.jobPosts.jobPostStatus = :jobPostStatus")
    long countAcceptedJobsByStatus(@Param("userId") Long userId,
                                   @Param("applicationStatus") ApplicationStatus applicationStatus,
                                   @Param("jobPostStatus") JobPostStatus jobPostStatus);


    List<Applications> findTop3ByUsers_IdOrderByDateDesc(Long workerId);
}
