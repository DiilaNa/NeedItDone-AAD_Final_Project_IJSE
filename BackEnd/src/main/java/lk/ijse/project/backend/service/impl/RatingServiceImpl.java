package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.RatingDTO;
import lk.ijse.project.backend.entity.JobPosts;
import lk.ijse.project.backend.entity.Rating;
import lk.ijse.project.backend.entity.User;
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
    private final ModelMapper modelMapper;
    private final JobPostRepository jobPostRepository;


    @Override
    @Transactional
    public void save(RatingDTO ratingDTO) {
        User user = (User) userRepository.findById(ratingDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));


        JobPosts jobPosts = (JobPosts) jobPostRepository.findById(ratingDTO.getJobPostId())
                .orElseThrow(() -> new RuntimeException(
                        "JobPost Not Found for id " + ratingDTO.getJobPostId()
                ));

        Rating rating = modelMapper.map(ratingDTO, Rating.class);
        rating.setUsers(user);
        rating.setJobPosts(jobPosts);

        ratingRepository.save(rating);


    }

    @Override
    @Transactional
    public void update(RatingDTO ratingDTO) {
        Rating rating = ratingRepository.findById(ratingDTO.getId());
        rating.setName(ratingDTO.getName());
        rating.setStars(ratingDTO.getStars());
        rating.setDescription(ratingDTO.getDescription());
        rating.setDate(ratingDTO.getDate());

        ratingRepository.save(rating);

    }

    @Override
    @Transactional(readOnly = true)
    public List<RatingDTO> getAll() {
        List<Rating> ratings = ratingRepository.findAll();
        if (ratings.isEmpty()) {
            throw new RuntimeException("No Ratings Found");
        }
        return modelMapper.map(ratings, new TypeToken<List<RatingDTO>>() {}.getType());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RatingDTO> getAllByKeyword(String keyword) {
       List<Rating> list = ratingRepository.findRatingByNameContainingIgnoreCase(keyword);
       if (list.isEmpty()) {
           throw new RuntimeException("No Ratings Found");
       }
       return modelMapper.map(list, new TypeToken<List<RatingDTO>>() {}.getType());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RatingDTO> getAlLPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Rating> applications = ratingRepository.findAll(pageable);
        return applications.map(application -> modelMapper.map(applications, RatingDTO.class));

    }
}
