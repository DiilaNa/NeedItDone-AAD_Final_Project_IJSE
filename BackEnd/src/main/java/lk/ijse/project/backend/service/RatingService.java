package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.dto.RatingDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface RatingService {
    void save(RatingDTO ratingDTO);
    void update(RatingDTO ratingDTO);
    void delete(RatingDTO ratingDTO);
    List<RatingDTO> getAll();
    List<RatingDTO> getAllByKeyword(String keyword);
    Page<RatingDTO> getAlLPaginated(int page, int size);
}
