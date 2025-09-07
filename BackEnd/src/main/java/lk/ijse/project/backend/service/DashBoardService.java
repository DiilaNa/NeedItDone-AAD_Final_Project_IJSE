package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.DashboardStatsHomeWorkerDTO;
import lk.ijse.project.backend.dto.WorkersDashBoardStatsDTO;

public interface DashBoardService {
     DashboardStatsHomeWorkerDTO getDashboardStats(Long userId) ;

    WorkersDashBoardStatsDTO getStats(Long workerId);
}
