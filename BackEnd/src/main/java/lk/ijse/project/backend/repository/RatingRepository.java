package lk.ijse.project.backend.repository;

import lk.ijse.project.backend.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    boolean existsByUsers_IdAndJobPosts_Id(Long userId, Long jobPostId);
}
