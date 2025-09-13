package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.RatingDTO;
import lk.ijse.project.backend.entity.JobPosts;
import lk.ijse.project.backend.entity.Rating;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.entity.enums.ApplicationStatus;
import lk.ijse.project.backend.entity.enums.RatingStatus;
import lk.ijse.project.backend.repository.JobPostRepository;
import lk.ijse.project.backend.repository.RatingRepository;
import lk.ijse.project.backend.repository.UserRepository;
import lk.ijse.project.backend.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final JobPostRepository jobPostRepository;
    private final ModelMapper modelMapper;

    @Override
    public Rating saveRating(RatingDTO dto) {
        User user = (User) userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        JobPosts jobPost = (JobPosts) jobPostRepository.findById(dto.getJobPostId())
                .orElseThrow(() -> new RuntimeException("Job post not found"));

        Rating rating = Rating.builder()
                .id(dto.getId())
                .name(dto.getName())
                .stars(dto.getStars())
                .description(dto.getDescription())
                .date(dto.getDate())
                .users(user)
                .status(RatingStatus.ADDED)
                .jobPosts(jobPost)
                .build();

        return ratingRepository.save(rating);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RatingDTO> getRecentRatings(Long workerId) {
        List<Rating> ratings = ratingRepository.findTop3ByWorkerId(workerId, PageRequest.of(0, 3));

        return ratings.stream()
                .map(r -> modelMapper.map(r, RatingDTO.class))
                .toList();
    }


}
