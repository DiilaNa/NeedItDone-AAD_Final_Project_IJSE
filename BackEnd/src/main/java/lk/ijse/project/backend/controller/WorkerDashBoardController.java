package lk.ijse.project.backend.controller;

import lk.ijse.project.backend.dto.ApplicationDTO;
import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import lk.ijse.project.backend.service.ApplicationService;
import lk.ijse.project.backend.service.JobPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/worker")
@RequiredArgsConstructor
public class WorkerDashBoardController {
    private final ApplicationService applicationService;
    private final JobPostService jobPostService;

    @GetMapping("/latest")
    public ResponseEntity<ApiResponseDTO> getLatestJobs() {
        List<JobPostDTO> jobPosts = jobPostService.getLatestJobPosts(10);
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

    @GetMapping("/getApplication")
    public ResponseEntity<ApiResponseDTO> getAllJobs() {
        List<ApplicationDTO> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Load all Applications posts successfully",
                        applications
                )
        );

    }
    @GetMapping("/search")
    public ResponseEntity<ApiResponseDTO> search(@RequestParam(required = false) String keyword) {
        List<JobPostDTO> applications =  jobPostService.getFilteredJobs(keyword);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Searched all Applications successfully",
                        applications
                )
        );
    }

}
