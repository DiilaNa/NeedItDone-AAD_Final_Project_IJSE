package lk.ijse.project.backend.controller;

import lk.ijse.project.backend.dto.*;
import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.entity.Applications;
import lk.ijse.project.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/worker")
@RequiredArgsConstructor
public class WorkerDashBoardController {
    private final ApplicationService applicationService;
    private final JobPostService jobPostService;
    private final UserService userService;
    private final DashBoardService dashBoardService;
    private final RatingService ratingService;

    @GetMapping("/stats/{workerId}")
    public ResponseEntity<ApiResponseDTO> stats(@PathVariable Long workerId) {
        WorkersDashBoardStatsDTO stats = dashBoardService.getStats(workerId);
        ResponseEntity.badRequest().body(stats);
        return ResponseEntity.ok(new ApiResponseDTO(200, "Worker stats loaded", stats));
    }

    @GetMapping("/recent-applications/{workerId}")
    public ResponseEntity<ApiResponseDTO> recentApplications(@PathVariable Long workerId) {
        System.out.println(workerId);
        List<ApplicationDTO> apps = applicationService.getRecentApplicationsDashBoard(workerId);
        System.out.println(apps);
        return ResponseEntity.ok(new ApiResponseDTO(200, "Recent applications loaded", apps));
    }

    @GetMapping("/recent-ratings/{workerId}")
    public ResponseEntity<ApiResponseDTO> recentRatings(@PathVariable Long workerId) {
        List<RatingDTO> ratings = ratingService.getRecentRatings(workerId);
        return ResponseEntity.ok(new ApiResponseDTO(200, "Recent ratings loaded", ratings));
    }

    @GetMapping("/latest/{userId}") /*LOAD Applications/ search*/
    public ResponseEntity<ApiResponseDTO> getLatestJobs(@PathVariable Long userId) {

        List<JobPostDTO> jobPosts = jobPostService.getLatestJobPosts(userId,10);
        return ResponseEntity.ok(new ApiResponseDTO(200, "Success", jobPosts));
    }

    @GetMapping("/pagination")
    public ResponseEntity<ApiResponseDTO> getAllPaginated(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<ApplicationDTO> applications = applicationService.getAllApplicationsPaginated(page, size);

        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Loaded Applications with pagination successfully",
                        applications
                )
        );
    }

    @GetMapping("/loadUserDetails")
    public ResponseEntity<ApiResponseDTO> getUserDetails() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(username)) {
            throw new RuntimeException("User not authenticated");
        }

        SignUpDTO list= userService.findByUserName(username);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "User details loaded Successfully",
                        list
                )
        );
    }

    @PostMapping("/saveApplication")
    public ResponseEntity<ApiResponseDTO> saveJob(@RequestBody ApplicationDTO applicationDTO) {
        applicationService.saveApplications(applicationDTO);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Applications saved Successfully",
                        "ok"
                )

        );
    }

    @PutMapping("/updateApplication")
    public ResponseEntity<ApiResponseDTO> updateJob(@RequestBody ApplicationDTO applicationDTO) {
        applicationService.updateApplications(applicationDTO);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Applications updated Successfully",
                        "ok"
                )

        );
    }

    @DeleteMapping("/deleteApplication")
    public ResponseEntity<ApiResponseDTO> deleteJob(@RequestBody ApplicationDTO applicationDTO) {
        applicationService.deleteApplications(applicationDTO);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Applications deleted Successfully",
                        "ok"
                )

        );
    }

    @GetMapping("/getApplication/{userID}")
    public ResponseEntity<ApiResponseDTO> getAllJobs(@PathVariable Long userID) {
        List<ApplicationDTO> applications = applicationService.getAllApplications(userID);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Load all Applications posts successfully",
                        applications
                )
        );

    }

    @GetMapping("/search")/*Load new Jobs to apply / SEARCH */
    public ResponseEntity<ApiResponseDTO> search(@RequestParam(required = false) String keyword , @RequestParam Long userID ) {
        List<JobPostDTO> applications =  jobPostService.getFilteredJobs(keyword,userID);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Searched all Applications successfully",
                        applications
                )
        );
    }

    @GetMapping("/{workerId}/active-jobs")/*Load new Jobs to apply /not search*/
    public ResponseEntity<List<ActiveJobDTO>> getActiveJobs(@PathVariable Long workerId) {
        List<ActiveJobDTO> jobs = applicationService.findActiveJobs(workerId);
        return ResponseEntity.ok(jobs);
    }

    @PutMapping("/mark-complete")
        public ResponseEntity<ApiResponseDTO> markComplete(
                @RequestParam Long applicationId,
                @RequestParam Long userId) {

            Applications updatedApp = applicationService.markAsComplete(applicationId, userId);
            return ResponseEntity.ok(new ApiResponseDTO(
                            200,
                            "Updated",
                            updatedApp
                    )
            );
    }

    @PutMapping("/updateUserWorkerController")
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

}
