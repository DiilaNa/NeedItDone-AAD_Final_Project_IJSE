package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.DashboardStatsHomeWorkerDTO;
import lk.ijse.project.backend.dto.WorkersDashBoardStatsDTO;
import lk.ijse.project.backend.entity.enums.ApplicationStatus;
import lk.ijse.project.backend.entity.enums.JobPostStatus;
import lk.ijse.project.backend.entity.enums.RatingStatus;
import lk.ijse.project.backend.repository.ApplicationRepository;
import lk.ijse.project.backend.repository.JobPostRepository;
import lk.ijse.project.backend.repository.RatingRepository;
import lk.ijse.project.backend.service.DashBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashBoardServiceImpl implements DashBoardService {
    private final JobPostRepository jobPostRepository;
    private final ApplicationRepository applicationRepository;
    private final RatingRepository ratingRepository;
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

    @Override
    @Transactional
    public WorkersDashBoardStatsDTO getStats(Long workerId) {
        long applicationsSent = applicationRepository.countByUsers_Id(workerId);

        long activeJobs = applicationRepository.countAcceptedJobsByStatus(
                workerId, ApplicationStatus.ACCEPTED, JobPostStatus.IN_PROGRESS);


        long completedJobs = applicationRepository.countAcceptedJobsByStatus(
                workerId, ApplicationStatus.COMPLETED, JobPostStatus.COMPLETED);

        Double avg = ratingRepository.averageStarsForWorker(workerId, RatingStatus.ADDED);
        double averageRating = avg == null ? 0.0 : Math.round(avg * 10.0) / 10.0; // one decimal


        return WorkersDashBoardStatsDTO.builder()
                .applicationsSentCount(applicationsSent)
                .activeJobsCount(activeJobs)
                .completedJobsCount(completedJobs)
                .averageRating(averageRating)
                .build();
    }
}
