package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.entity.Categories;
import lk.ijse.project.backend.entity.JobPosts;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.entity.enums.JobPostStatus;
import lk.ijse.project.backend.entity.enums.JobPostVisibility;
import lk.ijse.project.backend.repository.ApplicationRepository;
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
    private final ApplicationRepository applicationRepository;
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
        job.setJobPostStatus(JobPostStatus.IN_PROGRESS);
        job.setJobPostVisibility(JobPostVisibility.ENABLE);


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
    @Transactional(readOnly = true)
    public List<JobPostDTO> getAllJobPosts(Long userId) {
        User user = (User) userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<JobPosts> jobs = jobPostRepository.findByUsers(user);

        return jobs.stream()
                .map(job -> {
                    JobPostDTO dto = modelMapper.map(job, JobPostDTO.class);
                    long daysSincePosted = job.getPostedDate() != null ?
                            ChronoUnit.DAYS.between(job.getPostedDate(), LocalDate.now()) : 0;
                    dto.setDaysSincePosted((int) daysSincePosted);
                    dto.setApplicationsCount(jobPostRepository.countApplicationsByJobId(job.getId()));
                    dto.setCategoryName(job.getCategories() != null ? job.getCategories().getName() : null);
                    return dto;
                })
                .collect(Collectors.toList());
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

        return jobPostsPage.map(jobPosts ->{
            JobPostDTO dto = modelMapper.map(jobPosts,JobPostDTO.class);
            dto.setUsername(jobPosts.getUsers().getUsername());
            dto.setPostedDate(jobPosts.getPostedDate());
            dto.setJobPostStatus(jobPosts.getJobPostStatus());
            dto.setJobPostVisibility(jobPosts.getJobPostVisibility());
            return dto;
        });

    }

    @Override
    @Transactional
    public void deleteJobPostById(Long id) {
        jobPostRepository.deleteById(id);
    }

    @Override
    public JobPostDTO getJobById(Long id) {
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

    @Override
    public List<JobPostDTO> getLatestJobPosts(Long userId, int i) {
        return jobPostRepository.findDistinctTop10ByOrderByPostedDateDesc()
            .stream()
            .map(job -> {
                boolean applied = applicationRepository.existsByUsers_IdAndJobPosts_Id(userId, job.getId());

                JobPostDTO dto = modelMapper.map(job, JobPostDTO.class);
                dto.setCategoryName(job.getCategories() != null ? job.getCategories().getName() : "Uncategorized");
                dto.setApplicationsCount(jobPostRepository.countApplicationsByJobId(job.getId()));
                dto.setApplied(applied);
                dto.setJobPostVisibility(job.getJobPostVisibility());

                if (job.getPostedDate() != null) {
                    long days = ChronoUnit.DAYS.between(job.getPostedDate(), LocalDate.now());
                    dto.setDaysSincePosted((int) days);
                } else {
                    dto.setDaysSincePosted(0);
                }

                return dto;
            })
            .collect(Collectors.toList());
    }

    @Override
   public List<JobPostDTO> getFilteredJobs(String keyword, Long userId) {
        List<JobPosts> jobs = jobPostRepository.searchJobs(
                (keyword == null || keyword.isEmpty()) ? null : keyword
        );

        return jobs.stream()
                .map(job -> {
                    JobPostDTO dto = modelMapper.map(job, JobPostDTO.class);

                    boolean applied = applicationRepository.existsByUsers_IdAndJobPosts_Id(userId, job.getId());
                    dto.setApplied(applied);
                    dto.setJobPostVisibility(job.getJobPostVisibility());
                    dto.setCategoryName(job.getCategories() != null ? job.getCategories().getName() : null);

                    if (job.getPostedDate() != null) {
                        long days = ChronoUnit.DAYS.between(job.getPostedDate(), LocalDate.now());
                        dto.setDaysSincePosted((int) days);
                    } else {
                        dto.setDaysSincePosted(0);
                    }

                    dto.setApplicationsCount(job.getApplications() != null ? job.getApplications().size() : 0);

                    return dto;
                })
                .toList();
    }
    @Override
    public void disableJob(Long id) {
        JobPosts job = (JobPosts) jobPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (job.getJobPostVisibility() == JobPostVisibility.ENABLE){
            job.setJobPostVisibility(JobPostVisibility.DISABLE);
        }else {
            job.setJobPostVisibility(JobPostVisibility.ENABLE);
        }
        jobPostRepository.save(job);
    }

    @Override
    public List<JobPostDTO> searchJobs(String keyword) {
        List<JobPosts> jobs = jobPostRepository.findByJobTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrLocationContainingIgnoreCase(keyword, keyword, keyword);
        return modelMapper.map(jobs, new TypeToken<List<JobPostDTO>>(){}.getType());
    }

    @Override
    public List<JobPostDTO> getRecentJobs(Long userId) {
        List<JobPosts> jobs = jobPostRepository.findTop3ByUsers_IdOrderByPostedDateDesc(userId);

        return jobs.stream()
                .map(job -> {
                    JobPostDTO dto = modelMapper.map(job, JobPostDTO.class);
                    long daysSincePosted = job.getPostedDate() != null ?
                            ChronoUnit.DAYS.between(job.getPostedDate(), LocalDate.now()) : 0;
                    dto.setDaysSincePosted((int) daysSincePosted);
                    dto.setApplicationsCount(jobPostRepository.countApplicationsByJobId(job.getId()));

                    return dto;
                })
                .collect(Collectors.toList());

    }

    @Override
    public Object countActiveJobs() {
        return jobPostRepository.countByJobPostStatus(JobPostStatus.IN_PROGRESS);
    }

    @Override
    public Object countCompletedJobs() {
        return jobPostRepository.countByJobPostStatus(JobPostStatus.COMPLETED);
    }
}
