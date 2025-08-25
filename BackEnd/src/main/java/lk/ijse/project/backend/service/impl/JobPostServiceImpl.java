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

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

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

        Categories category = categoriesRepository.findByName(jobPostDTO.getCategoryName())
                .orElseGet(() -> {
                    Categories newCat = new Categories();
                    newCat.setName(jobPostDTO.getCategoryName());
                    return categoriesRepository.save(newCat);
                });

        JobPosts job = modelMapper.map(jobPostDTO, JobPosts.class);
        job.setUsers(user);
        job.setCategories(category);
        job.setPostedDate(LocalDate.now());


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

        LocalDate existingPostedDate = job.getPostedDate();

        modelMapper.map(jobPostDTO, job);
        job.setUsers(user);
        job.setCategories(category);
        job.setPostedDate(existingPostedDate);

        jobPostRepository.save(job);
    }

    @Override
    public List<JobPostDTO> getAllJobPosts() {
        return jobPostRepository.findAll()
                .stream()
                .map(job -> {
                    JobPostDTO dto = new JobPostDTO();
                    dto.setId(job.getId());
                    dto.setJobTitle(job.getJobTitle());
                    dto.setDescription(job.getDescription());
                    dto.setUrgency(job.getUrgency());
                    dto.setApplicationsCount(jobPostRepository.countApplicationsByJobId(job.getId()));

                    if (job.getPostedDate() != null) {
                        long days = ChronoUnit.DAYS.between(job.getPostedDate(), java.time.LocalDate.now());
                        dto.setDaysSincePosted((int) days);
                    } else {
                        dto.setDaysSincePosted(0);
                    }

                    return dto;
                }).collect(Collectors.toList());
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

    @Override
    @Transactional
    public void deleteJobPostById(Long id) {
        jobPostRepository.deleteById(id);
    }
    @Override
    public JobPostDTO getJobById(Long id) {
        System.out.println(id);
        JobPosts job = (JobPosts) jobPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job post not found"));


        JobPostDTO dto = modelMapper.map(job, JobPostDTO.class);
        long count = jobPostRepository.countApplicationsByJobId(job.getId());
        dto.setApplicationsCount(count);

        if (job.getPostedDate() != null) {
            long days = ChronoUnit.DAYS.between(job.getPostedDate(), LocalDate.now());
            dto.setDaysSincePosted((int) days);
        } else {
            dto.setDaysSincePosted(0);
        }

        return dto;
    }

}
