package lk.ijse.project.backend.controller;

import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.dto.RatingDTO;
import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import lk.ijse.project.backend.dto.login.SignUpDTO;
import lk.ijse.project.backend.service.JobPostService;
import lk.ijse.project.backend.service.RatingService;
import lk.ijse.project.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final RatingService ratingService;
    private final UserService userService;
    private final JobPostService jobPostService;

    @PostMapping("/saveRating")
    public ResponseEntity<ApiResponseDTO> saveRating(@RequestBody RatingDTO ratingDTO) {
        ratingService.save(ratingDTO);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Rating saved Successfully",
                        "ok"
                )

        );
    }

    @PutMapping("/updateRating")
    public ResponseEntity<ApiResponseDTO> updateRating(@RequestBody RatingDTO ratingDTO) {
        ratingService.update(ratingDTO);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Rating updated Successfully",
                        "ok"
                )

        );

    }

    @GetMapping("/get")
    public ResponseEntity<ApiResponseDTO> getALlRating() {
        List<RatingDTO> ratings = ratingService.getAll();
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Load all Ratings successfully",
                        ratings
                )
        );

    }

    @GetMapping("search/{keyword}")
    public ResponseEntity<ApiResponseDTO> search(@PathVariable String keyword) {
        List<SignUpDTO> users = userService.getAllUsersByKeyword(keyword);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Search ratings successfully",
                        users
                )
        );

    }

    @GetMapping("/getAllUserPagination")
    public ResponseEntity<ApiResponseDTO> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<SignUpDTO> users = userService.getAllUsersPaginated(page, size);

        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Loaded users with pagination successfully",
                        users
                )
        );
    }

    @PutMapping("/disableUser/{id}")
    public ResponseEntity<ApiResponseDTO> disableUser(@PathVariable Long id) {
        userService.disableUser(id);
        return ResponseEntity.ok(new ApiResponseDTO(200, "User disabled successfully", null));
    }

    @GetMapping("/getAllJobPostsPagination")
    public ResponseEntity<ApiResponseDTO> getAllJobPostsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Page<JobPostDTO> posts = jobPostService.getAllJobPostsPaginated(page, size);

        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Loaded Job Posts Successfully",
                        posts
                )
        );
    }

    @PutMapping("/disableJob/{id}")
    public ResponseEntity<ApiResponseDTO> disableJob(@PathVariable Long id) {
        jobPostService.disableJob(id);
        return ResponseEntity.ok(
                new ApiResponseDTO(200, "Job disabled successfully", null)
        );
    }

    @GetMapping("/searchJobs/{keyword}")
    public ResponseEntity<ApiResponseDTO> searchJobs(@PathVariable String keyword) {
        List<JobPostDTO> jobs = jobPostService.searchJobs(keyword);
        return ResponseEntity.ok(
                new ApiResponseDTO(200, "Search jobs successfully", jobs)
        );
    }


}
