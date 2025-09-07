package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.ActiveJobDTO;
import lk.ijse.project.backend.dto.ApplicationDTO;
import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.entity.Applications;
import lk.ijse.project.backend.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ApplicationService {
    void saveApplications(ApplicationDTO applicationDTO);
    void updateApplications(ApplicationDTO applicationDTO );
    void deleteApplications(ApplicationDTO applicationDTO);

    Page<ApplicationDTO> getAllApplicationsPaginated(int page, int size);

    List<ApplicationDTO> getAllApplications(Long userID);

    List<ApplicationDTO> getApplicationsForHomeowner(Long homeownerId);

    void updateApplicationStatus(Long applicationId, ApplicationStatus status);

    List<ActiveJobDTO> findActiveJobs(Long workerId);

    Applications markAsComplete(Long ApplicationID, Long userId);

    List<ApplicationDTO> getRecentApplications(Long userId);
    List<ApplicationDTO> getRecentApplicationsDashBoard(Long workerId);
}
