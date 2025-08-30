package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.JobPostDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface JobPostService {
    void saveJobPost(JobPostDTO jobPostDTO, String username);
    void updateJobPost(JobPostDTO jobPostDTO, String username );

    List<JobPostDTO> getAllJobPosts(Long id);

    List<JobPostDTO> getAllJobPostsByKeyword(String keyword);

    Page<JobPostDTO> getAllJobPostsPaginated(int page, int size);

    void deleteJobPostById(Long id);

    JobPostDTO getJobById(Long id);

    List<JobPostDTO> getLatestJobPosts(Long userId, int i);

    List<JobPostDTO> getFilteredJobs(String keyword, Long userId);

    void disableJob(Long id);
}
