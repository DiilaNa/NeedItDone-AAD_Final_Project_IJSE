package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.entity.JobPosts;
import lk.ijse.project.backend.repository.JobPostRepository;
import lk.ijse.project.backend.service.JobPost;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class JobPostImpl implements JobPost {
    private final JobPostRepository jobPostRepository;
    private final ModelMapper modelMapper;
    @Override
    public void saveJobPost(JobPostDTO jobPostDTO) {
        jobPostRepository.save(modelMapper.map(jobPostDTO, JobPosts.class));
    }

    @Override
    public void updateJobPost(JobPostDTO jobPostDTO) {
        jobPostRepository.save(modelMapper.map(jobPostDTO, JobPosts.class));
    }

    @Override
    public void deleteJobPost(JobPostDTO jobPostDTO) {
        jobPostRepository.delete(modelMapper.map(jobPostDTO, JobPosts.class));
    }

    @Override
    public List<JobPostDTO> getAllJobPosts() {
        List<JobPosts> list = jobPostRepository.findAll();
        if (list.isEmpty()) {
            throw new RuntimeException("not found");
        }
        return modelMapper.map(list,new TypeToken<List<JobPostDTO>>(){}.getType());
    }

    @Override
    public List<JobPostDTO> getAllJobPostsByKeyword(String keyword) {
        List<JobPosts> list = jobPostRepository.findJobPostsByJobTitleContainingIgnoreCase(keyword);
        if (list.isEmpty()) {
            throw new RuntimeException("not found");
        }
        return modelMapper.map(list,new TypeToken<List<JobPostDTO>>(){}.getType());
    }

    @Override
    public Page<JobPostDTO> getAllJobPostsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<JobPosts> jobPostsPage = jobPostRepository.findAll(pageable);

        return jobPostsPage.map(jobPosts -> modelMapper.map(jobPosts,JobPostDTO.class));
    }
}
