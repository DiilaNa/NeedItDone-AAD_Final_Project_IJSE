package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.entity.Categories;
import lk.ijse.project.backend.entity.JobPosts;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.repository.CategoriesRepository;
import lk.ijse.project.backend.repository.JobPostRepository;
import lk.ijse.project.backend.repository.UserRepository;
import lk.ijse.project.backend.service.JobPostService;
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
public class JobPostServiceImpl implements JobPostService {
    private final JobPostRepository jobPostRepository;
    private  final UserRepository userRepository;
    private final ModelMapper modelMapper;


    private final CategoriesRepository categoriesRepository;

    @Override
    @Transactional
    public void saveJobPost(JobPostDTO jobPostDTO, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Categories category = modelMapper.map(jobPostDTO, Categories.class);
        categoriesRepository.save(category);

        JobPosts job = modelMapper.map(jobPostDTO, JobPosts.class);
        job.setUsers(user);
        job.setCategories(category);

        jobPostRepository.save(job);

    }

    @Override
    @Transactional
    public void updateJobPost(JobPostDTO jobPostDTO, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Categories category = categoriesRepository
                .findByName(jobPostDTO.getCategoryName())
                .orElseGet(() -> {
                    Categories categories = new Categories();
                    categories.setName(jobPostDTO.getCategoryName());
                    return categoriesRepository.save(categories);
                });

        JobPosts job = (JobPosts) jobPostRepository.findById(jobPostDTO.getId())
                .orElseThrow(() -> new RuntimeException("Job post not found"));

        modelMapper.map(jobPostDTO, job);
        job.setUsers(user);
        job.setCategories(category);

        jobPostRepository.save(job);
    }


    @Override
    @Transactional
    public void deleteJobPost(JobPostDTO jobPostDTO) {
        JobPosts job = modelMapper.map(jobPostDTO, JobPosts.class);
        jobPostRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostDTO> getAllJobPosts() {
        List<JobPosts> list = jobPostRepository.findAll();
        if (list.isEmpty()) {
            throw new RuntimeException("not found");
        }
        return modelMapper.map(list,new TypeToken<List<JobPostDTO>>(){}.getType());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostDTO> getAllJobPostsByKeyword(String keyword) {
        List<JobPosts> list = jobPostRepository.findJobPostsByJobTitleContainingIgnoreCase(keyword);
        if (list.isEmpty()) {
            throw new RuntimeException("not found");
        }
        return modelMapper.map(list,new TypeToken<List<JobPostDTO>>(){}.getType());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobPostDTO> getAllJobPostsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<JobPosts> jobPostsPage = jobPostRepository.findAll(pageable);

        return jobPostsPage.map(jobPosts -> modelMapper.map(jobPosts,JobPostDTO.class));
    }
}
