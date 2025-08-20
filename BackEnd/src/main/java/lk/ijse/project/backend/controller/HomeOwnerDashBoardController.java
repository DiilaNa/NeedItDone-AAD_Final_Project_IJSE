package lk.ijse.project.backend.controller;

import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import lk.ijse.project.backend.service.JobPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
public class HomeOwnerDashBoardController {
    private final JobPostService jobPost;

    @PostMapping("/saveJob")
    public ResponseEntity<ApiResponseDTO> saveJob(@RequestBody JobPostDTO jobPostDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(username)) {
            throw new RuntimeException("User not authenticated");
        }
        jobPost.saveJobPost(jobPostDTO, username);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Job saved Successfully",
                        "ok"
                )

        );
    }

    @PutMapping("/updateJob")
    public ResponseEntity<ApiResponseDTO> updateJob(@RequestBody JobPostDTO jobPostDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(username)) {
            throw new RuntimeException("User not authenticated");
        }
        jobPost.updateJobPost(jobPostDTO,username);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Job updated Successfully",
                        "ok"
                )

        );
    }

    @DeleteMapping("/deleteJob")
    public ResponseEntity<ApiResponseDTO> deleteJob(@RequestBody JobPostDTO jobPostDTO) {
        jobPost.deleteJobPost(jobPostDTO);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Job deleted Successfully",
                        "ok"
                )

        );
    }

    @GetMapping("/get")
    public ResponseEntity<ApiResponseDTO> getAllJobs() {
        List<JobPostDTO> jobPosts = jobPost.getAllJobPosts();
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Load all Job posts successfully",
                        jobPosts
                )
        );

    }
    @GetMapping("search/{keyword}")
    public ResponseEntity<ApiResponseDTO> search(@PathVariable("keyword") String keyword) {
        List<JobPostDTO> jobs =  jobPost.getAllJobPostsByKeyword(keyword);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Searched all Jobs successfully",
                        jobs
                )
        );
    }
    @GetMapping("/pagination")
    public ResponseEntity<ApiResponseDTO> getAllPaginated(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<JobPostDTO> jobs = jobPost.getAllJobPostsPaginated(page, size);

        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Loaded job posts with pagination successfully",
                        jobs
                )
        );
    }
}

