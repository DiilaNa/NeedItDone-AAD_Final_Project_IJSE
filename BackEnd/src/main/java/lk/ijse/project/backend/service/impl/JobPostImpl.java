package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.service.JobPost;
import org.springframework.data.domain.Page;

import java.util.List;

public class JobPostImpl implements JobPost {
    @Override
    public void saveJobPost(JobPostDTO jobPostDTO) {

    }

    @Override
    public void updateJobPost(JobPostDTO jobPostDTO) {

    }

    @Override
    public void deleteJobPost(JobPostDTO jobPostDTO) {

    }

    @Override
    public List<JobPostDTO> getAllJobPosts() {
        return List.of();
    }

    @Override
    public List<JobPostDTO> getAllJobPostsByKeyword(String keyword) {
        return List.of();
    }

    @Override
    public Page<JobPostDTO> getAllJobPostsPaginated(int page, int size) {
        return null;
    }
}
