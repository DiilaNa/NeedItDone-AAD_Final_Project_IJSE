package lk.ijse.project.backend.repository;

import lk.ijse.project.backend.entity.Applications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ApplicationRepository extends JpaRepository<Applications,Integer> {
    List<Applications> findApplicationsByJobTitleContainingIgnoreCase(String jobTitle);

    Optional<Object> findById(Long id);

    boolean existsByUsersIdAndJobPostsId(Long userId, Long jobPostId);

    List<Applications> findByUsersId(Long userID);

    boolean existsByUsers_IdAndJobPosts_Id(Long userId, Long jobPostId);

    @Query("SELECT a FROM Applications a WHERE a.jobPosts.users.id = :homeownerId")
    List<Applications> findAllApplicationsForHomeowner(@Param("homeownerId") Long homeownerId);
}
