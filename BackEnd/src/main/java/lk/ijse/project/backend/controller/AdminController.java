package lk.ijse.project.backend.controller;

import lk.ijse.project.backend.dto.RatingDTO;
import lk.ijse.project.backend.dto.login.ApiResponseDTO;
import lk.ijse.project.backend.service.RatingService;
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

    @DeleteMapping("/deleteRating")
    public ResponseEntity<ApiResponseDTO> deleteRating(@RequestBody RatingDTO ratingDTO) {
        ratingService.delete(ratingDTO);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Rating deleted Successfully",
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
        List<RatingDTO> ratings = ratingService.getAllByKeyword(keyword);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Search ratings successfully",
                        ratings
                )
        );

    }

    @GetMapping("/pagination")
    public ResponseEntity<ApiResponseDTO> getAllPaginated(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<RatingDTO> ratings = ratingService.getAlLPaginated(page, size);
        return ResponseEntity.ok(
                new ApiResponseDTO(
                        200,
                        "Loaded ratings with pagination successfully",
                        ratings
                )
        );
    }
}
