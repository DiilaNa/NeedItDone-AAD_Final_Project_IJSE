package lk.ijse.project.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkersDashBoardStatsDTO {
        private long applicationsSentCount;
        private long activeJobsCount;
        private long completedJobsCount;
        private double averageRating;
}
