package lk.ijse.project.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardStatsHomeWorkerDTO {
    private long myJobsCount;
    private long applicationsCount;
    private long completedJobsCount;
    private long activeJobsCount;
}

