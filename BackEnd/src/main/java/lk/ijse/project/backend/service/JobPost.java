package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.JobPostDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface JobPost {
    void saveJobPost(JobPostDTO jobPostDTO);
    void updateJobPost(JobPostDTO jobPostDTO);
    void deleteJobPost(JobPostDTO jobPostDTO);

    List<JobPostDTO> getAllJobPosts();

    List<JobPostDTO> getAllJobPostsByKeyword(String keyword);

    Page<JobPostDTO> getAllJobPostsPaginated(int page, int size);
}
