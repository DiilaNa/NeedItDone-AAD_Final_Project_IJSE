package lk.ijse.project.backend.controller;

import jakarta.validation.Valid;
import lk.ijse.project.backend.dto.ApplicationDTO;
import lk.ijse.project.backend.dto.DashboardStatsHomeWorkerDTO;
import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.dto.RatingDTO;
import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.entity.JobPosts;
import lk.ijse.project.backend.entity.Rating;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
public class HomeOwnerDashBoardController {
    private final JobPostService jobPostService;
    private final UserService userService;
    private final ApplicationService applicationService;
    private final RatingService ratingService;
    private final DashBoardService dashBoardService;

    @GetMapping("/stats/{userId}")
    public ResponseEntity<ApiResponseDTO> getDashboardStats(@PathVariable Long userId) {
        DashboardStatsHomeWorkerDTO stats = dashBoardService.getDashboardStats(userId);

        return ResponseEntity.ok(new ApiResponseDTO(
                200,
                "Dashboard stats loaded successfully",
                stats
        ));
    }

    @PostMapping("/saveJob")
    public ResponseEntity<ApiResponseDTO> saveJob(@RequestBody JobPostDTO jobPostDTO) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            if ("anonymousUser".equals(username)) {
                throw new RuntimeException("User not authenticated");
            }

            jobPostService.saveJobPost(jobPostDTO, username);

            return ResponseEntity.ok(
                    new ApiResponseDTO(
                            200,
                            "Job saved Successfully",
                            "ok"
                    ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(new ApiResponseDTO(
                            500,
                            "Failed to save job: " + e.getMessage(),
                            null));
        }
    }

    @GetMapping("/recent/{userId}")
    public ResponseEntity<ApiResponseDTO> getRecentJobs(@PathVariable Long userId) {
        List<JobPostDTO> recentJobs = jobPostService.getRecentJobs(userId);

        if (recentJobs.isEmpty()) {
            return ResponseEntity.ok(new ApiResponseDTO(
                    200,
                    "No recent Jobs Found",
                    null
            ));
        }

        return ResponseEntity.ok(new ApiResponseDTO(
                200,
                "Recent jobs loaded successfully",
                recentJobs
        ));
    }

    @GetMapping("/recent-applications/{userId}")
    public ResponseEntity<ApiResponseDTO> getRecentApplications(@PathVariable Long userId) {
        List<ApplicationDTO> applications = applicationService.getRecentApplications(userId);

        if (applications.isEmpty()) {
            return ResponseEntity.ok(new ApiResponseDTO(
                    200,
                    "No applications found",
                    Collections.emptyList()
            ));
        }

        return ResponseEntity.ok(new ApiResponseDTO(
                200,
                "Recent applications loaded successfully",
                applications
        ));
    }



    @GetMapping("/loadUserDetails")
    public ResponseEntity<ApiResponseDTO> getUserDetails() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(username)) {
            throw new RuntimeException("User not authenticated");
        }

        SignUpDTO  list= userService.findByUserName(username);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "User details loaded Successfully",
                        list
                )
        );
    }

    @PutMapping("/updateUserHomeController")
    public ResponseEntity<ApiResponseDTO> updateUser(@RequestBody SignUpDTO signUpDTO) {
        String newToken = userService.updateUser(signUpDTO);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "User home Updated Successfully",
                        newToken
                )
        );
    }

    @PutMapping("/updateJob")
    public ResponseEntity<ApiResponseDTO> updateJob(@RequestBody JobPostDTO jobPostDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(username)) {
            throw new RuntimeException("User not authenticated");
        }
        jobPostService.updateJobPost(jobPostDTO,username);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Job updated Successfully",
                        "ok"
                )

        );
    }

    @DeleteMapping("/deleteJob/{id}")
    public ResponseEntity<ApiResponseDTO> deleteJob(@PathVariable Long id) {
        jobPostService.deleteJobPostById(id);
        return ResponseEntity.ok(new ApiResponseDTO(200, "Job deleted Successfully", "ok"));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ApiResponseDTO> getJobById(@PathVariable Long id) {
        JobPostDTO jobPostDTOS = jobPostService.getJobById(id);
        return ResponseEntity.ok(new ApiResponseDTO(200, "Job Updated Successfully", jobPostDTOS));

    }

    @GetMapping("/get{userID}")
    public ResponseEntity<ApiResponseDTO> getAllJobs(@PathVariable Long userID) {
        List<JobPostDTO> jobPosts = jobPostService.getAllJobPosts(userID);
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
        List<JobPostDTO> jobs =  jobPostService.getAllJobPostsByKeyword(keyword);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Searched all Jobs successfully",
                        jobs
                )
        );
    }

    @GetMapping("/getApplications/{homeownerId}")
    public ResponseEntity<ApiResponseDTO> getApplications(@PathVariable Long homeownerId) {
        List<ApplicationDTO> apps = applicationService.getApplicationsForHomeowner(homeownerId);
        return ResponseEntity.ok(
                new ApiResponseDTO(200, "Applications fetched successfully", apps)
        );
    }

    @PutMapping("/updateApplicationStatus/{applicationId}")
    public ResponseEntity<ApiResponseDTO> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody ApplicationDTO dto) {

        applicationService.updateApplicationStatus(applicationId,dto.getStatus());

        return ResponseEntity.ok(
                new ApiResponseDTO(200, "Application status updated successfully", null)
        );
    }

    @PostMapping("/ratings")
    public ResponseEntity<ApiResponseDTO> createRating(@RequestBody @Valid RatingDTO ratingDTO) {
        Rating rating = ratingService.saveRating(ratingDTO);
            return ResponseEntity.ok(
                        new ApiResponseDTO(
                                200,
                                "Rating added Successfully",
                                rating
                        )
            );
    }
}

