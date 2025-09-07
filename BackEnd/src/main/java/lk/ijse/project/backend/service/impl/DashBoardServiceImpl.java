package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.DashboardStatsHomeWorkerDTO;
import lk.ijse.project.backend.entity.enums.JobPostStatus;
import lk.ijse.project.backend.repository.ApplicationRepository;
import lk.ijse.project.backend.repository.JobPostRepository;
import lk.ijse.project.backend.service.DashBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashBoardServiceImpl implements DashBoardService {
    private final JobPostRepository jobPostRepository;
    private final ApplicationRepository applicationRepository;
    public DashboardStatsHomeWorkerDTO getDashboardStats(Long userId) {
        long myJobsCount = jobPostRepository.countByUsers_Id(userId);
        long applicationsCount = applicationRepository.countByJobPosts_Users_Id(userId);
        long completedJobsCount = jobPostRepository.countByUsers_IdAndJobPostStatus(userId, JobPostStatus.COMPLETED);
        long activeJobsCount = jobPostRepository.countByUsers_IdAndJobPostStatus(userId, JobPostStatus.IN_PROGRESS);

        return DashboardStatsHomeWorkerDTO.builder()
                .myJobsCount(myJobsCount)
                .applicationsCount(applicationsCount)
                .completedJobsCount(completedJobsCount)
                .activeJobsCount(activeJobsCount)
                .build();
    }
}
