package lk.ijse.project.backend.service;

import jakarta.validation.Valid;
import lk.ijse.project.backend.dto.RatingDTO;
import lk.ijse.project.backend.entity.Rating;
import org.springframework.data.domain.Page;

import java.util.List;

public interface RatingService {
    Rating saveRating(@Valid RatingDTO ratingDTO);

    List<RatingDTO> getRecentRatings(Long workerId);
}
