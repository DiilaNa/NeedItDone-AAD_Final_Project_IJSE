package lk.ijse.project.backend.repository;

import lk.ijse.project.backend.entity.Rating;
import lk.ijse.project.backend.entity.enums.ApplicationStatus;
import lk.ijse.project.backend.entity.enums.RatingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    boolean existsByUsers_IdAndJobPosts_Id(Long userId, Long jobPostId);

    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.users.id = :workerId AND r.status = :status")
    Double averageStarsForWorker(@Param("workerId") Long workerId, @Param("status") RatingStatus status);


}
