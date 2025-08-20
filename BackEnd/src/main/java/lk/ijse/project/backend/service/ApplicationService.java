package lk.ijse.project.backend.service;

import lk.ijse.project.backend.dto.ApplicationDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ApplicationService {
    void saveApplications(ApplicationDTO applicationDTO);
    void updateApplications(ApplicationDTO applicationDTO );
    void deleteApplications(ApplicationDTO applicationDTO);

    List<ApplicationDTO> getAllApplications();

    List<ApplicationDTO> getAllApplicationsByKeyword(String keyword);

    Page<ApplicationDTO> getAllApplicationsPaginated(int page, int size);
}
